import React, { useState } from 'react';
import { TestCase, SubmissionResult } from '@/types/dsa';
import { CheckCircle2, XCircle, Circle, ChevronDown, ChevronRight } from 'lucide-react';

interface TestCaseDisplayProps {
    testCases: TestCase[];
    result: SubmissionResult | null;
}

function diffLines(a: string, b: string) {
    const aLines = a.split('\n');
    const bLines = b.split('\n');
    const max = Math.max(aLines.length, bLines.length);
    return Array.from({ length: max }, (_, i) => ({
        expected: aLines[i] ?? '',
        received: bLines[i] ?? '',
        same: aLines[i] === bLines[i],
    }));
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

                const diffs = isFailed && result?.failedTestCase
                    ? diffLines(tc.expectedOutput, result.failedTestCase.received)
                    : null;

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
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Input</p>
                                        <pre className="bg-muted rounded-lg p-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                                            {tc.input}
                                        </pre>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Expected</p>
                                        <pre className="bg-muted rounded-lg p-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                                            {tc.expectedOutput}
                                        </pre>
                                    </div>
                                </div>

                                {isFailed && result?.failedTestCase && (
                                    <div>
                                        <p className="text-xs font-semibold text-destructive mb-1.5 uppercase tracking-wide">Your Output</p>
                                        {diffs ? (
                                            <div className="bg-muted rounded-lg p-3 text-xs font-mono space-y-0.5 overflow-x-auto">
                                                {diffs.map((d, di) => (
                                                    <div
                                                        key={di}
                                                        className={`${!d.same ? 'text-destructive bg-destructive/10 rounded px-1' : 'text-muted-foreground'}`}
                                                    >
                                                        {d.received || '\u00a0'}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <pre className="bg-muted rounded-lg p-3 text-xs font-mono text-destructive overflow-x-auto whitespace-pre-wrap">
                                                {result.failedTestCase.received}
                                            </pre>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
