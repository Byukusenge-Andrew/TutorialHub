import React, { useState } from 'react';
import { TestCase, SubmissionResult } from '@/types/dsa';
import { CheckCircle2, XCircle, Circle, ChevronDown, ChevronRight } from 'lucide-react';

interface TestCaseDisplayProps {
    testCases: TestCase[];
    result: SubmissionResult | null;
}

function formatValue(val: unknown): string {
    if (val === undefined || val === null) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'number' || typeof val === 'boolean') return String(val);
    try {
        return JSON.stringify(val, null, 2);
    } catch (e) {
        return String(val);
    }
}

export function TestCaseDisplay({ testCases, result }: TestCaseDisplayProps) {
    const [open, setOpen] = useState<Record<number, boolean>>({});

    const toggle = (i: number) => setOpen((prev) => ({ ...prev, [i]: !prev[i] }));

    if (!testCases || testCases.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <Circle className="h-8 w-8 mb-2 opacity-30" />
                <p className="text-sm">No visible test cases for this exercise.</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {testCases.map((tc, index) => {
                const isFailed =
                    result &&
                    !result.success &&
                    result.failedTestCase &&
                    result.failedTestCase.input === tc.input;

                const isPassed = result?.success;
                const isOpen = open[index] ?? (isFailed ? true : index === 0);

                let icon = <Circle className="h-4 w-4 text-muted-foreground shrink-0" />;
                let borderClass = 'border-border';
                let bgClass = '';

                if (isPassed) {
                    icon = <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />;
                    borderClass = 'border-emerald-500/30';
                    bgClass = '';
                } else if (isFailed) {
                    icon = <XCircle className="h-4 w-4 text-destructive shrink-0" />;
                    borderClass = 'border-destructive/30';
                    bgClass = 'bg-destructive/5';
                }

                const expectedStr = formatValue(tc.expectedOutput);
                const receivedStr = result?.failedTestCase ? formatValue(result.failedTestCase.received) : '';

                return (
                    <div key={index} className={`rounded-xl border ${borderClass} ${bgClass} overflow-hidden transition-colors`}>
                        {/* Header (clickable) */}
                        <button
                            onClick={() => toggle(index)}
                            className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-muted/40 transition-colors text-left"
                        >
                            {icon}
                            <span className="text-sm font-medium flex-1">Case {index + 1}</span>
                            {tc.explanation && (
                                <span className="text-xs text-muted-foreground hidden sm:block truncate max-w-[200px]">
                                    {tc.explanation}
                                </span>
                            )}
                            {isOpen ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                            ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                            )}
                        </button>

                        {/* Body */}
                        {isOpen && (
                            <div className="px-4 pb-4 space-y-3 border-t border-border/50 pt-3">
                                <div className={`grid ${result ? 'grid-cols-3' : 'grid-cols-2'} gap-3`}>
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Input</p>
                                        <pre className="bg-muted rounded-lg p-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                                            {formatValue(tc.input)}
                                        </pre>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Expected</p>
                                        <pre className="bg-muted rounded-lg p-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                                            {expectedStr}
                                        </pre>
                                    </div>
                                    {result && (
                                        <div>
                                            <p className={`text-xs font-semibold mb-1.5 uppercase tracking-wide ${isFailed ? 'text-destructive' : 'text-emerald-500'}`}>
                                                Your Output
                                            </p>
                                            <pre className={`rounded-lg p-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed ${isFailed ? 'bg-destructive/10 text-destructive' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}`}>
                                                {isPassed ? expectedStr : (receivedStr || 'No output')}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
