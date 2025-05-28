export function RightMouseClick() {
    return (
        <div
            className="fixed top-0 left-0 w-screen h-screen z-[6] overflow-hidden bg-transparent"
            onMouseDown={(e) => {
                const button = e.button;
                e.preventDefault();
                e.stopPropagation();
                console.log(button);
            }}
        ></div>
    );
}
