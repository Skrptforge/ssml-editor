import ExpandingTextbox from "../create/ExpandingTextbox";
import ScriptHeader from "../create/ScriptHeader";

export const MainContent = () => {
  const handleTextboxSubmit = (value: string) => {
    console.log("Script modification:", value);
    // TODO: Implement script modification logic
  };

  return (
    <div className="relative ">
      <ScriptHeader />
      <ExpandingTextbox
        placeholder="Modify script..."
        onSubmit={handleTextboxSubmit}
      />
    </div>
  );
};
