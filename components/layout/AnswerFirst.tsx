interface AnswerFirstProps {
  /** Bold opening phrase (answer-in-one-line) */
  bold: string;
  /** Rest of the explanation after the bold */
  rest: string;
}

/**
 * AnswerFirst — AEO-optimized quick answer block.
 * Bold phrase + explanation — structured for AI Overview extraction.
 */
export default function AnswerFirst({ bold, rest }: AnswerFirstProps) {
  return (
    <div className="answer-first">
      <p>
        <strong>{bold}</strong>
        {rest}
      </p>
    </div>
  );
}
