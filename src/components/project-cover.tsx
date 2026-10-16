import type { Project } from "../data";
import Icon from "./ui/icon";
export default function Cover({
  project: p,
  small = false,
}: {
  project: Project;
  small?: boolean;
}) {
  return (
    <div
      className={`project-cover ${p.color} ${small ? "small" : ""}`}
      aria-hidden="true"
    >
      <div className="cover-grid" />
      <span className="cover-edition">
        GITHUB COLLECTION / {String(p.order + 1).padStart(2, "0")}
      </span>
      <div className="cover-symbol">
        <Icon name={p.icon} size={50} />
      </div>
      <div className="cover-title">
        {p.name}
        <span>
          {p.category === "study"
            ? "Ideas worth learning."
            : p.category === "mac"
              ? "Make your everyday better."
              : p.category === "ai"
                ? "A little more possible."
                : "Good tools. Great possibilities."}
        </span>
      </div>
      <span className="cover-seal">
        <Icon name="github" size={13} /> THE OPEN COLLECTION
      </span>
    </div>
  );
}
