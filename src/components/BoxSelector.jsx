import { useState } from "react";

export default function BoxSelector({ options, productPrice }) {
    const [wantsBox, setWantsBox] = useState(null); // "yes" | "no"
    const [selectedBox, setSelectedBox] = useState("");
    // Find the selected box data based on the selectedBox ID
    const selectedBoxData = options.find((o) => o.id === selectedBox) || null;

    return (
        <div className="p-4 bg-white rounded-xl shadow-md w-full max-w-lg space-y-4">
            {/* YES / NO TOGGLE */}
            <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-800">Box Available?</span>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="boxAvailable"
                        value="yes"
                        checked={wantsBox === "yes"}
                        onChange={() => setWantsBox("yes")}
                    />
                    Yes
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="boxAvailable"
                        value="no"
                        checked={wantsBox === "no"}
                        onChange={() => {
                            setWantsBox("no");
                            setSelectedBox("");
                        }}
                    />
                    No
                </label>
            </div>

            {/* DROPDOWN WHEN YES */}
            {wantsBox === "yes" && (
                <div className="flex flex-col gap-2">
                    <span className="text-gray-700 font-medium">Select Box</span>

                    <select
                        value={selectedBox}
                        onChange={(e) => setSelectedBox(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-black"
                    >
                        <option value="">Choose a Box</option>

                        {options.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                                {opt.name} (+₹{opt.price})
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* When a box is selected, display its details */}
            {selectedBox !== "" && selectedBoxData && <>
                <div className="w-full bg-white rounded-lg shadow-md p-4 flex gap-4 ">
                    {/* Left side: Image */}
                    <div className="w-32 h-32 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                        {selectedBoxData.image ? (
                            <img
                                src={selectedBoxData.image}
                                alt={selectedBoxData.name || "Box Image"}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                No Image
                            </div>
                        )}
                    </div>

                    {/* Right side: Details */}
                    <div className="flex flex-col justify-between flex-1">
                        <div>
                            <h4 className="text-lg font-semibold">
                                {selectedBoxData.name || "No Box Selected"}
                            </h4>

                            {/* Price */}
                            {selectedBoxData.price && (
                                <div className="flex py-2 pe-3">
                                    <span className="text-gray-300 mr-1 mt-1 text-sm">₹</span>
                                    <span className="font-semibold text-black text-2xl">
                                        {selectedBoxData.price}
                                    </span>
                                </div>
                            )}

                            {/* Link */}
                            {selectedBoxData.link && (
                                <a
                                    href={selectedBoxData.link}
                                    target="_blank"
                                    className="text-blue-600 underline text-sm mt-1 inline-block"
                                >
                                    View product
                                </a>
                            )}
                        </div>

                        {/* Quantity selector (if needed) */}
                        {selectedBoxData.link && (
                            <div className="mt-3 flex items-center gap-2">
                                <label className="text-sm">Qty:</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={selectedBoxData.qty || 1}
                                    onChange={(e) =>
                                        setSelectedBox({
                                            ...selectedBoxData,
                                            qty: Number(e.target.value),
                                        })
                                    }
                                    className="w-16 border rounded px-2 py-1 text-sm"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-full max-w-sm bg-white rounded-xl  p-4 space-y-3">
                    {/* Options Amount */}
                    <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">Options Amount</span>
                        <span className="font-semibold text-gray-900">₹{selectedBoxData.price}</span>
                    </div>

                    {/* Divider */}
                    <div className="border-t"></div>

                    {/* Final Total */}
                    <div className="flex justify-between text-base">
                        <span className="font-semibold text-gray-800">Final Total</span>
                        <span className="font-bold text-black">₹{productPrice + selectedBoxData.price}</span>
                    </div>
                </div>
            </>}

        </div>
    );
}
