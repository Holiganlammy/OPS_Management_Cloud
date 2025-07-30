import { useState } from "react";
import dayjs from "dayjs";

export default function DateTimeInputWithOk({
  value,
  onConfirm,
}: {
  value: Date;
  onConfirm: (date: Date) => void;
}) {
  const [tempDate, setTempDate] = useState(dayjs(value).format("YYYY-MM-DDTHH:mm"));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempDate(e.target.value);
  };

  const handleConfirm = () => {
    onConfirm(new Date(tempDate));
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        type="datetime-local"
        className="border rounded px-2 py-1 w-full"
        value={tempDate}
        onChange={handleChange}
      />
      <button
        onClick={handleConfirm}
        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
      >
        OK
      </button>
    </div>
  );
}
