interface HelpTableProps {
  headers: string[];
  rows: React.ReactNode[][];
}

export default function HelpTable({ headers, rows }: HelpTableProps) {
  return (
    <div className="rounded-xl overflow-hidden border border-[#C6C6C8]/40 mt-3 overflow-x-auto">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="bg-[#F2F2F7]">
            {headers.map((h, i) => (
              <th
                key={i}
                className="text-left px-3 py-2 font-semibold text-black/80 whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className={
                ri !== rows.length - 1
                  ? "border-t border-[#C6C6C8]/30"
                  : ""
              }
            >
              {row.map((cell, ci) => (
                <td key={ci} className="px-3 py-2 text-black/85 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}