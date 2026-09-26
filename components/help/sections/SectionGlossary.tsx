import HelpSubsection from "../HelpSubsection";

export default function SectionGlossary() {
  const terms = [
    { term: "PAT", def: "Personal Access Token — a secure string that acts like a password for API access." },
    { term: "SHA", def: "Secure Hash Algorithm — the unique 40-character identifier for a commit. Short SHAs (first 7 chars) are commonly used." },
    { term: "Branch", def: "A parallel version of the repository. The default branch is usually 'main' or 'master'." },
    { term: "Commit", def: "A snapshot of changes made to the repository at a specific point in time." },
    { term: "Tree", def: "In Git, a directory structure that points to files and sub-trees." },
    { term: "Blob", def: "Binary Large Object — a file's content stored as a single unit in Git." },
    { term: "Ref", def: "A reference to a commit, like a branch pointer or tag." },
    { term: "HEAD", def: "The current branch pointer — where your working directory is now." },
    { term: "Origin", def: "The default remote name — usually points to the GitHub server." },
    { term: "Clone", def: "A local copy of a remote repository." },
    { term: "Diff", def: "The difference between two versions of a file — additions and deletions." },
    { term: "Queue", def: "In GitH Mobile, a staging area for pending changes before commit." },
    { term: "Rollback", def: "Reverting the repository to a previous commit's state. In GitH Mobile, this is non-destructive." },
    { term: "PR", def: "Pull Request — a proposal to merge changes from one branch into another." },
    { term: "Scope", def: "A permission level on a Personal Access Token, like 'repo' or 'public_repo'." },
    { term: "Rate limit", def: "The maximum number of API calls allowed per hour (5000 for authenticated users)." },
    { term: "PWA", def: "Progressive Web App — a website that can be installed like a native app." },
    { term: "TWA", def: "Trusted Web Activity — an Android wrapper that hosts a PWA as a native app." },
  ];

  return (
    <>
      <p className="text-[15px] text-black/85 leading-relaxed">
        Terms you might encounter while using GitH Mobile.
      </p>

      <HelpSubsection title="Glossary">
        <div className="rounded-xl border border-[#C6C6C8]/40 overflow-hidden mt-2">
          {terms.map((item, i) => (
            <div
              key={item.term}
              className={`flex flex-col sm:flex-row gap-1 sm:gap-4 px-3.5 py-3 ${
                i !== terms.length - 1 ? "border-b border-[#C6C6C8]/30" : ""
              }`}
            >
              <span className="font-mono text-[13px] font-semibold text-black shrink-0 sm:w-[120px]">
                {item.term}
              </span>
              <span className="text-[13px] text-black/75 leading-relaxed flex-1">
                {item.def}
              </span>
            </div>
          ))}
        </div>
      </HelpSubsection>
    </>
  );
}