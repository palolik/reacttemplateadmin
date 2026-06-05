import { base_url } from "../Config/config";

const FileInput = ({ label, file, onChange }) => (
  <div className="flex flex-col gap-1">
    <span className="text-sm text-gray-600">{label}</span>
    <label className="flex items-center gap-2 cursor-pointer border border-gray-300 rounded px-3 py-2 bg-white hover:bg-gray-50">
      <span className="bg-black text-white text-xs px-3 py-1 rounded">CHOOSE FILE</span>
      <span className="text-sm text-gray-500 truncate">
        {file ? file.name : "No file chosen"}
      </span>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onChange}
      />
    </label>
    {file && (
      <img
        src={URL.createObjectURL(file)}
        className="w-[160px] h-[60px] mt-1 rounded shadow object-cover"
        alt="Preview"
      />
    )}
  </div>
);

const FileInputEdit = ({ label, file, existingUrl, onChange, previewClass }) => (
  <div className="flex flex-col gap-1">
    <span className="text-sm text-gray-600">{label}</span>
    <label className="flex items-center gap-2 cursor-pointer border border-gray-300 rounded px-3 py-2 bg-white hover:bg-gray-50">
      <span className="bg-black text-white text-xs px-3 py-1 rounded">CHOOSE FILE</span>
      <span className="text-sm text-gray-500 truncate">
        {file ? file.name : existingUrl ? "Current file" : "No file chosen"}
      </span>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onChange}
      />
    </label>
    {(file || existingUrl) && (
      <img
        src={file ? URL.createObjectURL(file) : `${base_url}${existingUrl}`}
        className={`mt-1 rounded shadow object-cover ${previewClass}`}
        alt="Preview"
      />
    )}
  </div>
);

export { FileInput, FileInputEdit };