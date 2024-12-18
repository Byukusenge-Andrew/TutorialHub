import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';
import User from '../models/User';
import { AuthError } from '../utils/errors';

type UserResponse = { password?: string } & Omit<IUser, 'password'>;

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private readonly JWT_EXPIRES_IN = '24h';

  async register(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ user: IUser; token: string }> {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new AuthError('Email already registered');
    }

    const user = await User.create(userData);
    const token = this.generateToken(user);
    const userResponse = user.toObject() as UserResponse;
    delete userResponse.password;

    return { user: userResponse as IUser, token };
  }

  async login(email: string, password: string): Promise<{ user: IUser; token: string }> {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      throw new AuthError('Invalid credentials');
    }

    const token = this.generateToken(user);
    const userResponse = user.toObject() as UserResponse;
    delete userResponse.password;

    return { user: userResponse as IUser, token };
  }

  async validate(token: string): Promise<{ user: IUser }> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as { id: string };
      const user = await User.findById(decoded.id);
      
      if (!user) {
        throw new AuthError('User not found');
      }

      const userResponse = user.toObject() as UserResponse;
      delete userResponse.password;

      return { user: userResponse as IUser };
    } catch (error) {
      throw new AuthError('Invalid token');
    }
  }

  private generateToken(user: IUser): string {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    );
  }
}

export default new AuthService(); 