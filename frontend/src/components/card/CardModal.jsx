import React from "react";
import { useParams } from "react-router";

const CardModal = ({
    mode,
    cardTitle,
    create,
    showDetail,
    setCardTitle, setEdit, selectCard, setSelectCard, updateCard,
    setForm, addCard
}) => {
  const { boardId } = useParams();

  const handleAddCard = async () => {
    if (!cardTitle.trim()) return;
    await addCard(boardId, cardTitle);
    setCardTitle("");
    setForm(false);
  };

    const handleUpdateCard = async () => {
    if (!cardTitle.trim()) return;
    await updateCard(selectCard, cardTitle);
    setCardTitle("");
    setEdit(false);
    setSelectCard(null);
  };
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-10">
      {mode === "detail" ? (
        <div className="bg-white p-6 rounded-lg shadow-lg w-75 sm:w-96 relative close">
        <div
          className="absolute flex right-3 top-2 cursor-pointer"
          onClick={() => showDetail(false)}
        >
          <i className="fa-solid fa-xmark"></i>
        </div>
        <h2 className="text-xl font-bold mb-4 text-center">Card Information</h2>
        <div className="flex gap-2">
          <div>
            <p className="p-2 font-semibold">Name:</p>
            <p className="p-2 font-semibold">Created at:</p>
          </div>
          <div>
            <p className="p-2 text-gray-600 font-semibold italic capitalize">
              {cardTitle}
            </p>
            <p className="p-2 text-gray-600 font-semibold italic">{create}</p>
          </div>
        </div>
      </div>
      ) : mode === "edit" ? (
        <div className="bg-white p-6 rounded-lg shadow-lg w-75 sm:w-96 relative close">
        <div
          className="absolute flex right-3 top-2 cursor-pointer"
          onClick={() => {
            setEdit(false), setSelectCard(null);
          }}
        >
          <i className="fa-solid fa-xmark"></i>
        </div>
        <h2 className="text-xl font-bold mb-4 text-center">Edit Card</h2>
        <input
          type="text"
          value={cardTitle}
          onChange={(e) => setCardTitle(e.target.value)}
          placeholder="Enter card title"
          className="input mb-4 w-full focus:outline-none"
        />
        <button
          onClick={handleUpdateCard}
          className="bg-blue-500 text-white font-semibold cursor-pointer w-full py-2 rounded hover:bg-blue-600"
        >
          Confirm
        </button>
      </div>
      ) : (
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-10">
              <div className="bg-white p-6 rounded-lg shadow-lg w-75 sm:w-96 relative close">
                <div
                  className="absolute flex right-3 top-2 cursor-pointer"
                  onClick={() => setForm(false)}
                >
                  <i className="fa-solid fa-xmark"></i>
                </div>
                <h2 className="text-xl font-bold mb-4 text-center">
                  Create New Card
                </h2>
                <input
                  type="text"
                  value={cardTitle}
                  onChange={(e) => setCardTitle(e.target.value)}
                  placeholder="Enter card title"
                  className="input mb-4 w-full focus:outline-none"
                />
                <button
                  onClick={handleAddCard}
                  className="bg-blue-500 text-white font-semibold cursor-pointer w-full py-2 rounded hover:bg-blue-600"
                >
                  Confirm
                </button>
              </div>
            </div>
      )}
    </div>
  );
};

export default CardModal;
