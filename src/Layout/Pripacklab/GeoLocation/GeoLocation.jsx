import Swal from 'sweetalert2';
import { useEffect, useRef, useState } from "react";
import { base_url } from '../../../config/config';

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 relative max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
      </div>
      {children}
    </div>
  </div>
);

function downloadTemplate(filename, content) {
  const blob = new Blob([content], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const DISTRICT_TEMPLATE = [
  "name,nameBn,division",
  "Dhaka,ঢাকা,Dhaka Division",
  "Chattogram,চট্টগ্রাম,Chattogram Division",
  "Khulna,খুলনা,Khulna Division",
  "Rajshahi,রাজশাহী,Rajshahi Division",
  "Sylhet,সিলেট,Sylhet Division",
  "Barishal,বরিশাল,Barishal Division",
  "Rangpur,রংপুর,Rangpur Division",
  "Mymensingh,ময়মনসিংহ,Mymensingh Division",
].join("\n");

const AREA_TEMPLATE = [
  "name,nameBn,district",
  "Dhanmondi,ধানমণ্ডি,Dhaka",
  "Gulshan,গুলশান,Dhaka",
  "Mirpur,মিরপুর,Dhaka",
  "Uttara,উত্তরা,Dhaka",
  "Agrabad,আগ্রাবাদ,Chattogram",
  "Panchlaish,পাঁচলাইশ,Chattogram",
].join("\n");

const CSVImporter = ({ label, templateContent, templateFilename, onImport, onDone }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setResult(null);
    try {
      const res = await onImport(file);
      setResult(res);
      onDone();
    } catch (err) {
      setResult({ errors: [{ error: 'Upload failed' }] });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-1">
      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => downloadTemplate(templateFilename, templateContent)}
          className="smbut"
        >
          CSV Template
        </button>
        <label className={`smbut cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {uploading ? 'Uploading…' : `Import ${label} CSV`}
          <input ref={inputRef} type="file" accept=".csv,text/csv" onChange={handleFile} disabled={uploading} className="hidden" />
        </label>
      </div>

      {result && (
        <div className={`rounded-md px-3 py-2 text-xs border ${result.errors?.length ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
          <span className="font-bold">
            {result.inserted ?? 0} inserted{result.updated != null ? `, ${result.updated} updated` : ''}{result.skipped ? `, ${result.skipped} skipped` : ''}
            {' '}/ {result.total ?? 0} total
          </span>
          {result.errors?.length ? (
            <ul className="mt-1 space-y-0.5">
              {result.errors.slice(0, 5).map((e, i) => (
                <li key={i}>{e.row ? `"${e.row}": ` : ''}{e.error}</li>
              ))}
              {result.errors.length > 5 && <li>…and {result.errors.length - 5} more</li>}
            </ul>
          ) : null}
        </div>
      )}
    </div>
  );
};

const GeoLocation = () => {
  const [districts, setDistricts] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const [isAddDistrictOpen, setIsAddDistrictOpen] = useState(false);
  const [editingDistrict, setEditingDistrict] = useState(null);

  const [isAddAreaOpen, setIsAddAreaOpen] = useState(false);
  const [editingArea, setEditingArea] = useState(null);

  const fetchDistricts = () => {
    fetch(`${base_url}/districts`)
      .then(res => res.json())
      .then(data => setDistricts(Array.isArray(data) ? data : []))
      .catch(error => console.error('Error fetching districts:', error));
  };

  const fetchAreas = (districtId) => {
    fetch(`${base_url}/areas?district=${districtId}`)
      .then(res => res.json())
      .then(data => setAreas(Array.isArray(data) ? data : []))
      .catch(error => console.error('Error fetching areas:', error));
  };

  useEffect(() => {
    fetchDistricts();
  }, []);

  useEffect(() => {
    if (selectedDistrict) fetchAreas(selectedDistrict._id);
    else setAreas([]);
  }, [selectedDistrict]);

  const handleDistrictSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const districtData = {
      name: form.name.value.trim(),
      nameBn: form.nameBn.value.trim(),
      division: form.division.value.trim(),
    };

    const url = editingDistrict
      ? `${base_url}/editdistrict/${editingDistrict._id}`
      : `${base_url}/adddistrict`;
    const method = editingDistrict ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(districtData),
      });
      const data = await response.json();

      if (!response.ok) {
        Swal.fire("Error!", data.message || "Something went wrong.", "error");
        return;
      }

      Swal.fire("Success!", editingDistrict ? "District updated." : "District added.", "success");
      form.reset();
      setIsAddDistrictOpen(false);
      setEditingDistrict(null);
      fetchDistricts();
    } catch (error) {
      console.error('Error saving district:', error);
      Swal.fire("Error!", "Unexpected error occurred.", "error");
    }
  };

  const handleDeleteDistrict = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will not delete its areas automatically.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${base_url}/deldistrict/${_id}`, { method: "DELETE" })
          .then(res => res.json())
          .then((data) => {
            if (data.deletedCount > 0) {
              Swal.fire("Deleted!", "District removed.", "success");
              setDistricts(prev => prev.filter(d => d._id !== _id));
              if (selectedDistrict?._id === _id) setSelectedDistrict(null);
            }
          });
      }
    });
  };

  const handleAreaSubmit = async (event) => {
    event.preventDefault();
    if (!selectedDistrict) return;

    const form = event.target;
    const areaData = {
      name: form.name.value.trim(),
      nameBn: form.nameBn.value.trim(),
      district: selectedDistrict._id,
    };

    const url = editingArea
      ? `${base_url}/editarea/${editingArea._id}`
      : `${base_url}/addarea`;
    const method = editingArea ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(areaData),
      });
      const data = await response.json();

      if (!response.ok) {
        Swal.fire("Error!", data.message || "Something went wrong.", "error");
        return;
      }

      Swal.fire("Success!", editingArea ? "Area updated." : "Area added.", "success");
      form.reset();
      setIsAddAreaOpen(false);
      setEditingArea(null);
      fetchAreas(selectedDistrict._id);
    } catch (error) {
      console.error('Error saving area:', error);
      Swal.fire("Error!", "Unexpected error occurred.", "error");
    }
  };

  const handleImportDistricts = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${base_url}/importdistricts`, { method: 'POST', body: formData });
    return res.json();
  };

  const handleImportAreas = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${base_url}/importareas`, { method: 'POST', body: formData });
    return res.json();
  };

  const handleDeleteArea = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This area will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${base_url}/delarea/${_id}`, { method: "DELETE" })
          .then(res => res.json())
          .then((data) => {
            if (data.deletedCount > 0) {
              Swal.fire("Deleted!", "Area removed.", "success");
              setAreas(prev => prev.filter(a => a._id !== _id));
            }
          });
      }
    });
  };

  return (
    <div className="w-full">
      <div className="hdr">Geo Location</div>

      <div className="w-full p-2 grid grid-cols-1 lg:grid-cols-2 gap-3">

        {/* Districts */}
        <div>
          <div className="bg-white pl-2 mb-2 flex justify-between items-center">
            <span className="font-semibold">Districts</span>
            <button className="smbut" onClick={() => { setEditingDistrict(null); setIsAddDistrictOpen(true); }}>
              + Add District
            </button>
          </div>

          <CSVImporter
            label="Districts"
            templateFilename="districts_template.csv"
            templateContent={DISTRICT_TEMPLATE}
            onImport={handleImportDistricts}
            onDone={fetchDistricts}
          />

          <div className="tabst mt-2">
            <div>Name</div>
            <div>Bangla Name</div>
            <div>Division</div>
            <div>Action</div>
          </div>

          <div className="flex flex-col">
            {districts.map((d) => (
              <div
                key={d._id}
                onClick={() => setSelectedDistrict(d)}
                className={`tabc cursor-pointer ${selectedDistrict?._id === d._id ? 'bg-slate-100' : ''}`}
              >
                <div>{d.name}</div>
                <div>{d.nameBn}</div>
                <div>{d.division}</div>
                <div className="flex gap-1">
                  <button onClick={(e) => { e.stopPropagation(); setEditingDistrict(d); setIsAddDistrictOpen(true); }} className="smbut">Edit</button>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteDistrict(d._id); }} className="smbut">Delete</button>
                </div>
              </div>
            ))}

            {districts.length === 0 && (
              <div className="tabc"><div className="text-center py-4 col-span-4">No districts found.</div></div>
            )}
          </div>
        </div>

        {/* Areas */}
        <div>
          <div className="bg-white pl-2 mb-2 flex justify-between items-center">
            <span className="font-semibold">
              Areas {selectedDistrict ? `— ${selectedDistrict.name}` : ''}
            </span>
            <button
              className="smbut"
              disabled={!selectedDistrict}
              onClick={() => { setEditingArea(null); setIsAddAreaOpen(true); }}
            >
              + Add Area
            </button>
          </div>

          {!selectedDistrict ? (
            <div className="text-sm text-gray-400 px-2">Select a district to manage its areas.</div>
          ) : (
            <>
              <CSVImporter
                label="Areas"
                templateFilename="areas_template.csv"
                templateContent={AREA_TEMPLATE}
                onImport={handleImportAreas}
                onDone={() => fetchAreas(selectedDistrict._id)}
              />

              <div className="tabst mt-2">
                <div>Name</div>
                <div>Bangla Name</div>
                <div>Action</div>
              </div>

              <div className="flex flex-col">
                {areas.map((a) => (
                  <div key={a._id} className="tabc">
                    <div>{a.name}</div>
                    <div>{a.nameBn}</div>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditingArea(a); setIsAddAreaOpen(true); }} className="smbut">Edit</button>
                      <button onClick={() => handleDeleteArea(a._id)} className="smbut">Delete</button>
                    </div>
                  </div>
                ))}

                {areas.length === 0 && (
                  <div className="tabc"><div className="text-center py-4 col-span-3">No areas found.</div></div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* District Modal */}
      {isAddDistrictOpen && (
        <Modal
          title={editingDistrict ? "Edit District" : "Add District"}
          onClose={() => { setIsAddDistrictOpen(false); setEditingDistrict(null); }}
        >
          <form onSubmit={handleDistrictSubmit} className="flex flex-col gap-3">
            <label>
              <span>Name</span>
              <input name="name" type="text" defaultValue={editingDistrict?.name || ""} className="priinput" required />
            </label>
            <label>
              <span>Bangla Name</span>
              <input name="nameBn" type="text" defaultValue={editingDistrict?.nameBn || ""} className="priinput" />
            </label>
            <label>
              <span>Division</span>
              <input name="division" type="text" defaultValue={editingDistrict?.division || ""} className="priinput" />
            </label>
            <div className="flex gap-2 mt-2">
              <button type="submit" className="pributton flex-1">
                {editingDistrict ? "Update District" : "Add District"}
              </button>
              <button type="button" onClick={() => { setIsAddDistrictOpen(false); setEditingDistrict(null); }}
                className="btn flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 border-0">Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Area Modal */}
      {isAddAreaOpen && (
        <Modal
          title={editingArea ? "Edit Area" : "Add Area"}
          onClose={() => { setIsAddAreaOpen(false); setEditingArea(null); }}
        >
          <form onSubmit={handleAreaSubmit} className="flex flex-col gap-3">
            <label>
              <span>Name</span>
              <input name="name" type="text" defaultValue={editingArea?.name || ""} className="priinput" required />
            </label>
            <label>
              <span>Bangla Name</span>
              <input name="nameBn" type="text" defaultValue={editingArea?.nameBn || ""} className="priinput" />
            </label>
            <div className="flex gap-2 mt-2">
              <button type="submit" className="pributton flex-1">
                {editingArea ? "Update Area" : "Add Area"}
              </button>
              <button type="button" onClick={() => { setIsAddAreaOpen(false); setEditingArea(null); }}
                className="btn flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 border-0">Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default GeoLocation;
