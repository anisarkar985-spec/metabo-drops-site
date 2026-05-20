interface SectionBarProps {
  children: React.ReactNode;
  id?: string;
}

/**
 * SectionBar — Styled H2 heading with decorative bars.
 * Used across the site for major section headings.
 */
export default function SectionBar({ children, id }: SectionBarProps) {
  return (
    <div className="section-bar" id={id}>
      <h2>{children}</h2>
    </div>
  );
}
