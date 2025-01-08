// utils/FormatMessage.tsx

export const formatMessage = (text: string): React.ReactNode => {
  const formattedLines = text.split("\n").map((line, index) => (
    <div key={`line-${index}`} style={{ marginBottom: "5px" }}>
      {line.split("\t").map((tab, tabIndex) => (
        <span key={`tab-${index}-${tabIndex}`} style={{ marginLeft: tabIndex > 0 ? "2em" : "0" }}>
          {tab}
        </span>
      ))}
    </div>
  ));

  return <>{formattedLines}</>;
};
