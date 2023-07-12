import { useCallback, useState } from "react";
import GithubAlert from "./components/GithubAlert";
import Title from "./components/Title";
import Description from "./components/Description";
import PasswordsInput from "./components/PasswordsInput";
import DragModal from "./components/DragModal";
import { useDropzone } from "react-dropzone";
import { useAppStore } from "./state/useAppStore";

export default function App() {
  const processPasswords = useAppStore(state => state.processPasswords);

  const [loadingDrop, setLoadingDrop] = useState<boolean>(false);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setLoadingDrop(true);
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = async () => {
        await processPasswords(reader.result as string);
        setLoadingDrop(false);
      }
      reader.readAsText(file)
    })
    
  }, [processPasswords])
  const {getRootProps, isDragActive} = useDropzone({onDrop, noClick: true});


  return (
    <div {...getRootProps()}>
      <DragModal isDragging={isDragActive || loadingDrop} />
      <Title />
      <GithubAlert />
      <Description />
      <PasswordsInput />
    </div>
  );
}
