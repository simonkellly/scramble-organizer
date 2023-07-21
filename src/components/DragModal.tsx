import { useSavedStore } from "../state/useSavedStore";

export default function DragModal({ isDragging }: { isDragging: boolean }) {
  const [shownDrag, setShownDrag] = useSavedStore((state) => [state.shownDrag, state.setShownDrag]);

  if (!isDragging && shownDrag) return <></>;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-prose">
        <div className="artboard artboard-horizontal"></div>
        <h3 className="font-bold text-lg">Drop Passwords File</h3>
        <div className="justify-center w-full pt-4">
          <label className="flex flex-col rounded-lg border-4 border-base-300 border-dashed w-full group text-center">
            <br />
            <br />
            <p className="text-center align-middle">Drop the generated passwords file here. It should be called something like: <code className="kbd">COMP_NAME_-_Computer_Display_PDF_Passcodes_-_SECRET.txt</code></p>
            <br />
            <br />
          </label>
        </div>
        {shownDrag && (<button className="btn btn-primary mt-4" onClick={() => setShownDrag()}>Close</button>)}
      </div>
    </div>
  );
}
