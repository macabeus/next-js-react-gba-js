import { useEffect, useState, useContext } from "react";

const getFileContent = async (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onerror = (ev) => {
      reject(ev.target.error)
    }

    reader.onload = (ev) => {
      const { result } = ev.target

      if (typeof result === 'string') {
        reject(new Error('Wrong file type'))
        return
      }

      const buffer = new Uint8Array(result)
      resolve(buffer)
    }

    reader.readAsArrayBuffer(file)
  })

const InputROM = ({ GbaContext }) => {
    const {
        play: playGba,
    } = useContext(GbaContext)

    const onChangeHandle = async (event) => {
        const [file] = event.target.files
        const fileContent = await getFileContent(file)
        playGba({ newRomBuffer: fileContent })
    }

    return (
        <input
            type='file'
            onChange={onChangeHandle}
        />
    )
}

export default function Emulator() {
    const [reactGbaJsModule, setReactGbaJsModule] = useState()

      useEffect(() => {
        const importModule = async () => {
            const { default: ReactGbaJs, GbaContext, GbaProvider } = await import("react-gbajs")
            
            setReactGbaJsModule({ ReactGbaJs, GbaContext, GbaProvider })
        }

        importModule()
    })

    if (reactGbaJsModule === undefined) {
        return <p>Loading ReactGbaJs</p>
    }

    return (
        <reactGbaJsModule.GbaProvider>
            <InputROM GbaContext={reactGbaJsModule.GbaContext} />
            <reactGbaJsModule.ReactGbaJs />
        </reactGbaJsModule.GbaProvider>
    )
}
