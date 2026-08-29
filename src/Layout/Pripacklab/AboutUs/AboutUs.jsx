import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import '../../../styles/pripack.css';
import { base_url } from "../../../config/config";
import RichTextEditor from "../../../utils/PichTextEditor";

const ICON_OPTIONS = ["Package", "Clock", "Shield", "Award", "Users", "MapPin"];

const emptyAbout = {
  heroTag: "", heroTagBn: "",
  heroTitleMain: "", heroTitleMainBn: "",
  heroTitleHighlight: "", heroTitleHighlightBn: "",
  heroDescription: "", heroDescriptionBn: "",
  officeLabel: "", officeLabelBn: "",
  officeAddress: "", officeAddressBn: "",
  officeEmail: "",
  stats: [],
  values: [],
  mapTag: "", mapTagBn: "",
  mapTitle: "", mapTitleBn: "",
  mapDescription: "", mapDescriptionBn: "",
  coverageCards: [],
  ctaTitle: "", ctaTitleBn: "",
  ctaDescription: "", ctaDescriptionBn: "",
  ctaEmail: "",
};

const AboutUs = () => {
  const [about, setAbout] = useState(emptyAbout);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${base_url}/aboutus`)
      .then((res) => res.json())
      .then((data) => setAbout({ ...emptyAbout, ...data }))
      .catch((err) => console.error("Error fetching about us:", err))
      .finally(() => setLoading(false));
  }, []);

  const setField = (field, value) => setAbout((prev) => ({ ...prev, [field]: value }));

  const setListItem = (field, index, key, value) => {
    setAbout((prev) => {
      const list = [...prev[field]];
      list[index] = { ...list[index], [key]: value };
      return { ...prev, [field]: list };
    });
  };

  const addListItem = (field, item) => {
    setAbout((prev) => ({ ...prev, [field]: [...prev[field], item] }));
  };

  const removeListItem = (field, index) => {
    setAbout((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...about };
      delete payload._id;
      delete payload.updatedAt;
      const res = await fetch(`${base_url}/aboutus`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.message === "About us updated successfully") {
        Swal.fire("Saved!", "About Us page updated.", "success");
      } else {
        Swal.fire("Error!", "Failed to update About Us page.", "error");
      }
    } catch (err) {
      console.error("Error updating about us:", err);
      Swal.fire("Error!", "Something went wrong.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="hdr">About Us Page</div>
        <div className="px-6 py-10 text-center text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="hdr">About Us Page</div>

      <div className="px-6 py-4 flex flex-col gap-8 max-w-4xl">

        {/* Hero */}
        <section className="flex flex-col gap-3">
          <h3 className="text-base font-semibold text-gray-800">Hero Section</h3>
          <div className="grid grid-cols-2 gap-3">
            <input className="priinput" placeholder="Tag (e.g. About PriPackLab)"
              value={about.heroTag} onChange={(e) => setField("heroTag", e.target.value)} />
            <input className="priinput" placeholder="Tag (Bangla)"
              value={about.heroTagBn} onChange={(e) => setField("heroTagBn", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input className="priinput" placeholder="Title (main)"
              value={about.heroTitleMain} onChange={(e) => setField("heroTitleMain", e.target.value)} />
            <input className="priinput" placeholder="Title (main, Bangla)"
              value={about.heroTitleMainBn} onChange={(e) => setField("heroTitleMainBn", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input className="priinput" placeholder="Title (highlighted)"
              value={about.heroTitleHighlight} onChange={(e) => setField("heroTitleHighlight", e.target.value)} />
            <input className="priinput" placeholder="Title (highlighted, Bangla)"
              value={about.heroTitleHighlightBn} onChange={(e) => setField("heroTitleHighlightBn", e.target.value)} />
          </div>
          <p className="text-xs text-gray-400">Company story</p>
          <RichTextEditor
            value={about.heroDescription}
            onChange={(html) => setField("heroDescription", html)}
            placeholder="Write the company story..."
          />
          <p className="text-xs text-gray-400">Company story (Bangla)</p>
          <RichTextEditor
            value={about.heroDescriptionBn}
            onChange={(html) => setField("heroDescriptionBn", html)}
            placeholder="বাংলায় কোম্পানির গল্প লিখুন..."
          />
          <div className="grid grid-cols-2 gap-3">
            <input className="priinput" placeholder="Office label (e.g. Head Office)"
              value={about.officeLabel} onChange={(e) => setField("officeLabel", e.target.value)} />
            <input className="priinput" placeholder="Office label (Bangla)"
              value={about.officeLabelBn} onChange={(e) => setField("officeLabelBn", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input className="priinput" placeholder="Office address"
              value={about.officeAddress} onChange={(e) => setField("officeAddress", e.target.value)} />
            <input className="priinput" placeholder="Office address (Bangla)"
              value={about.officeAddressBn} onChange={(e) => setField("officeAddressBn", e.target.value)} />
          </div>
          <input className="priinput" placeholder="Office email"
            value={about.officeEmail} onChange={(e) => setField("officeEmail", e.target.value)} />
        </section>

        {/* Stats */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-800">Stats</h3>
            <button className="smbut" onClick={() => addListItem("stats", { label: "", labelBn: "", value: "" })}>
              + Add Stat
            </button>
          </div>
          {about.stats.map((s, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input className="priinput" placeholder="Value (e.g. 50,000+)"
                value={s.value} onChange={(e) => setListItem("stats", i, "value", e.target.value)} />
              <input className="priinput" placeholder="Label (e.g. Products Delivered)"
                value={s.label} onChange={(e) => setListItem("stats", i, "label", e.target.value)} />
              <input className="priinput" placeholder="Label (Bangla)"
                value={s.labelBn} onChange={(e) => setListItem("stats", i, "labelBn", e.target.value)} />
              <button className="smbut" onClick={() => removeListItem("stats", i)}>Remove</button>
            </div>
          ))}
        </section>

        {/* Values */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-800">Why Choose Us (Values)</h3>
            <button className="smbut" onClick={() => addListItem("values", { icon: "Package", title: "", titleBn: "", desc: "", descBn: "" })}>
              + Add Value
            </button>
          </div>
          {about.values.map((v, i) => (
            <div key={i} className="flex flex-col gap-2 p-3 border rounded-lg">
              <div className="flex gap-2 items-center">
                <select className="pridrop w-32" value={v.icon}
                  onChange={(e) => setListItem("values", i, "icon", e.target.value)}>
                  {ICON_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <input className="priinput" placeholder="Title"
                  value={v.title} onChange={(e) => setListItem("values", i, "title", e.target.value)} />
                <input className="priinput" placeholder="Title (Bangla)"
                  value={v.titleBn} onChange={(e) => setListItem("values", i, "titleBn", e.target.value)} />
                <button className="smbut" onClick={() => removeListItem("values", i)}>Remove</button>
              </div>
              <textarea className="pritextarea" placeholder="Description"
                value={v.desc} onChange={(e) => setListItem("values", i, "desc", e.target.value)} />
              <textarea className="pritextarea" placeholder="Description (Bangla)"
                value={v.descBn} onChange={(e) => setListItem("values", i, "descBn", e.target.value)} />
            </div>
          ))}
        </section>

        {/* Map section */}
        <section className="flex flex-col gap-3">
          <h3 className="text-base font-semibold text-gray-800">Nationwide Coverage Section</h3>
          <div className="grid grid-cols-2 gap-3">
            <input className="priinput" placeholder="Tag (e.g. Nationwide Coverage)"
              value={about.mapTag} onChange={(e) => setField("mapTag", e.target.value)} />
            <input className="priinput" placeholder="Tag (Bangla)"
              value={about.mapTagBn} onChange={(e) => setField("mapTagBn", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input className="priinput" placeholder="Title"
              value={about.mapTitle} onChange={(e) => setField("mapTitle", e.target.value)} />
            <input className="priinput" placeholder="Title (Bangla)"
              value={about.mapTitleBn} onChange={(e) => setField("mapTitleBn", e.target.value)} />
          </div>
          <textarea className="pritextarea" placeholder="Description"
            value={about.mapDescription} onChange={(e) => setField("mapDescription", e.target.value)} />
          <textarea className="pritextarea" placeholder="Description (Bangla)"
            value={about.mapDescriptionBn} onChange={(e) => setField("mapDescriptionBn", e.target.value)} />
        </section>

        {/* Coverage cards */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-800">Coverage Highlights</h3>
            <button className="smbut" onClick={() => addListItem("coverageCards", { icon: "Users", title: "", titleBn: "", desc: "", descBn: "" })}>
              + Add Highlight
            </button>
          </div>
          {about.coverageCards.map((c, i) => (
            <div key={i} className="flex flex-col gap-2 p-3 border rounded-lg">
              <div className="flex gap-2 items-center">
                <select className="pridrop w-32" value={c.icon}
                  onChange={(e) => setListItem("coverageCards", i, "icon", e.target.value)}>
                  {ICON_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <input className="priinput" placeholder="Title"
                  value={c.title} onChange={(e) => setListItem("coverageCards", i, "title", e.target.value)} />
                <input className="priinput" placeholder="Title (Bangla)"
                  value={c.titleBn} onChange={(e) => setListItem("coverageCards", i, "titleBn", e.target.value)} />
                <button className="smbut" onClick={() => removeListItem("coverageCards", i)}>Remove</button>
              </div>
              <textarea className="pritextarea" placeholder="Description"
                value={c.desc} onChange={(e) => setListItem("coverageCards", i, "desc", e.target.value)} />
              <textarea className="pritextarea" placeholder="Description (Bangla)"
                value={c.descBn} onChange={(e) => setListItem("coverageCards", i, "descBn", e.target.value)} />
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="flex flex-col gap-3">
          <h3 className="text-base font-semibold text-gray-800">Call To Action</h3>
          <div className="grid grid-cols-2 gap-3">
            <input className="priinput" placeholder="Title"
              value={about.ctaTitle} onChange={(e) => setField("ctaTitle", e.target.value)} />
            <input className="priinput" placeholder="Title (Bangla)"
              value={about.ctaTitleBn} onChange={(e) => setField("ctaTitleBn", e.target.value)} />
          </div>
          <textarea className="pritextarea" placeholder="Description"
            value={about.ctaDescription} onChange={(e) => setField("ctaDescription", e.target.value)} />
          <textarea className="pritextarea" placeholder="Description (Bangla)"
            value={about.ctaDescriptionBn} onChange={(e) => setField("ctaDescriptionBn", e.target.value)} />
          <input className="priinput" placeholder="Contact email"
            value={about.ctaEmail} onChange={(e) => setField("ctaEmail", e.target.value)} />
        </section>

        <div>
          <button className="pributton" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
