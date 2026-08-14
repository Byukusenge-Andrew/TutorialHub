import { VM } from 'vm2';
import { performance } from 'perf_hooks';
import { TestCase } from '../models/DSAChallenge';

interface ExecutionResult {
  passed: boolean;
  executionTime: number;
  memory: number;
  error?: string;
  failedTestCase?: number;
  output?: unknown;
}

export class CodeExecutionService {
  private static readonly TIMEOUT = 2000; // 2 seconds
  private static readonly MEMORY_LIMIT = 128; // 128 MB

  static async executeJavaScript(code: string, testCases: TestCase[]): Promise<ExecutionResult> {
    const vm = new VM({
      timeout: this.TIMEOUT,
      sandbox: {},
      eval: false,
      wasm: false
    });

    try {
      // Wrap user code in a function exporter
      const wrappedCode = `
        ${code}

        let targetFn;
        try {
          if (typeof solution === 'function') targetFn = solution;
          else if (typeof twoSum === 'function') targetFn = twoSum;
          else if (typeof main === 'function') targetFn = main;
          else if (typeof solve === 'function') targetFn = solve;
        } catch (e) {}

        module.exports = targetFn;
      `;

      const fn = vm.run(wrappedCode);
      if (typeof fn !== 'function') {
        return {
          passed: false,
          executionTime: 0,
          memory: process.memoryUsage().heapUsed / 1024 / 1024,
          error: 'No valid solution function (e.g. solution or twoSum) found in submitted code'
        };
      }
      
      // Define startTime variable here
      let startTime = performance.now();
      
      // Test against all test cases
      for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        startTime = performance.now();
        
        try {
          const rawInput = testCase.input;
          const args = Array.isArray(rawInput) ? rawInput : [rawInput];
          const result = fn(...args);
          const executionTime = performance.now() - startTime;
          
          const expected = testCase.output !== undefined ? testCase.output : (testCase as unknown as { expectedOutput: unknown }).expectedOutput;
          
          // Deep equality check
          if (JSON.stringify(result) !== JSON.stringify(expected)) {
            return {
              passed: false,
              executionTime,
              memory: process.memoryUsage().heapUsed / 1024 / 1024,
              failedTestCase: i,
              output: result
            };
          }
        } catch (error) {
          return {
            passed: false,
            executionTime: performance.now() - startTime,
            memory: process.memoryUsage().heapUsed / 1024 / 1024,
            error: error instanceof Error ? error.message : String(error),
            failedTestCase: i
          };
        }
      }

      return {
        passed: true,
        executionTime: performance.now() - startTime,
        memory: process.memoryUsage().heapUsed / 1024 / 1024
      };
    } catch (error) {
      return {
        passed: false,
        executionTime: 0,
        memory: process.memoryUsage().heapUsed / 1024 / 1024,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  static async executeCode(
    code: string,
    language: string,
    testCases: TestCase[]
  ): Promise<{ passed: boolean; executionTime: number; memory: number; failedTestCase?: number }> {
    try {
      const startTime = Date.now();
      
      switch (language) {
        case 'javascript':
        case 'typescript': {
          const result = await this.executeJavaScript(code, testCases);
          const executionTime = Date.now() - startTime;
          return {
            passed: result.passed,
            executionTime,
            memory: result.memory,
            failedTestCase: result.failedTestCase
          };
        }
        // Add support for other languages here
        default:
          throw new Error(`Unsupported language: ${language}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Code execution error:', error.message);
      } else {
        console.error('Unknown code execution error:', error);
      }
      throw new Error('Code execution failed');
    }
  }
} 