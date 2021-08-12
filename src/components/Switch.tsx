
interface SwitchProps{
    toggled: boolean,
    onToggle: () => void
}

export default function Switch({ toggled, onToggle }: SwitchProps) {

    const toggle = () => {

        //Emit given callback
        onToggle()
    }

    return (
        <div className="flex items-center justify-center mt-1">

        <button className="focus:outline-none" onClick={toggle} title="Toggle Dark Mode">
            <div className={"w-10 h-6 flex items-center rounded-full p-1 bg-gray-200 dark:bg-gray-400 " + (toggled && "bg-accent dark:bg-accent")}>

                <div className={"bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out " + (toggled && "translate-x-4")}></div>

            </div>
        </button>

    </div>
    )
}
