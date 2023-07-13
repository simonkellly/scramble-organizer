import { ChangeEvent, useState } from "react";
import { useAppStore } from "../state/useAppStore";

export default function PasswordsInput() {
  const competitionId = useAppStore((state) => state.competitionId);
  const setCompetitionId = useAppStore((state) => state.setCompetitionId);
  const changeCompId = (event: ChangeEvent<HTMLInputElement>) => {
    setCompetitionId(event.target.value);
  };

  const passwords = useAppStore((state) => state.passwords);
  const setPasswords = useAppStore((state) => state.setPasswords);
  const changePasswords = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setPasswords(event.target.value);
  };

  const [loading, setLoading] = useState(false);
  const processPasswords = useAppStore((state) => state.processPasswords);
  const clickSort = () => {
    setLoading(true);
    processPasswords(false)
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  const sorted = useAppStore((state) => state.sorted);
  const clickCopy = () => {
    navigator.clipboard.writeText(passwords).catch((error) => console.error(error));
  };

  return (
    <div className="mt-4">
      <div className="form-control py-1">
        <label htmlFor="comp-id">
          <span className="label-text bold">Competition Id</span>
        </label>
        <input
          type="text"
          className="input input-bordered invalid:input-error w-full max-w-xs"
          id="comp-id"
          maxLength={32}
          placeholder="ExampleComp2030"
          pattern="[a-zA-Z0-9]+20[a-zA-Z0-9]{2}$"
          title="Competition Id as seen in the URL of the competition page"
          value={competitionId}
          onChange={changeCompId}
          disabled={loading}
        />
      </div>
      <div className="form-control py-1">
        <label htmlFor="passwords">
          <span className="label-text bold">Passwords</span>
        </label>
        <textarea
          className="textarea textarea-bordered invalid:textarea-error"
          id="passwords"
          rows={10}
          cols={60}
          placeholder="Paste the scramble passwords here or drop the file containing them"
          value={passwords}
          onChange={changePasswords}
          disabled={loading}
        />
      </div>
      <button
        type="submit"
        id="sort"
        className="btn btn-primary"
        onClick={clickSort}
        disabled={loading}
      >
        Sort The Scrambles!
      </button>
      {sorted && (
        <button
          type="button"
          id="copy"
          className="btn btn-primary float-right btn-square"
          onClick={clickCopy}
          disabled={loading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            className="h-5 w-5 fill-primary-content"
          >
            {/* <!-- Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --> */}
            <path d="M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" />
          </svg>
        </button>
      )}
    </div>
  );
}
