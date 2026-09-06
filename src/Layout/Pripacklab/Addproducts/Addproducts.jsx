import { useState, useEffect } from 'react';
import RichTextEditor from '../../../utils/PichTextEditor';
import Swal from 'sweetalert2';
import { base_url } from '../../../config/config';

const PRESET_CRITERIA = ['Size', 'Cut', 'Color', 'Material', 'Quantity', 'Weight'];

const PAddproducts = () => {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [filteredSubcategories, setFilteredSubcategories] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [sellerId, setSellerId] = useState('');

    // Criteria: [{ name: 'Size', values: ['S','M','L'] }]
    const [criteria, setCriteria] = useState([]);
    const [selectedCriteria, setSelectedCriteria] = useState('');
    const [customCriteriaName, setCustomCriteriaName] = useState('');
    const [valueInputs, setValueInputs] = useState({}); // { criteriaName: inputString }

    // Variants: [{ id, combination: {}, label, price, profit, discount, is_active }]
    const [variants, setVariants] = useState([]);
    const [variantsGenerated, setVariantsGenerated] = useState(false);

    const [tagNames, setTagNames] = useState([]);
    const [tagInput, setTagInput] = useState('');

    const [image, setImage] = useState([]);
    const [formKey, setFormKey] = useState(0);
    const [productData, setProductData] = useState({
        category: '',
        subCategory: '',
        productName: '',
        productNameBn: '',
        productDescription: '',
        productDescriptionBn: '',
        productSupplier: '',
        deliveryTime: ''
    });

    useEffect(() => {
        fetch(`${base_url}/getcatnsub`)
            .then(res => res.json())
            .then(data => {
                setCategories(data.categories);
                setSubcategories(data.subcategories);
            })
            .catch(err => console.error('Error fetching categories:', err));

        fetch(`${base_url}/sellers`)
            .then(res => res.json())
            .then(data => setSellers(Array.isArray(data) ? data : []))
            .catch(err => console.error('Error fetching sellers:', err));
    }, []);

    useEffect(() => {
        if (productData.category) {
            const filtered = subcategories.filter(
                sub => sub.catname.toLowerCase() === productData.category.toLowerCase()
            );
            setFilteredSubcategories(filtered);
        } else {
            setFilteredSubcategories([]);
        }
    }, [productData.category, subcategories]);

    // ─── Criteria Management ───────────────────────────────────────────────────

    const handleAddCriteria = () => {
        const name = selectedCriteria === 'Custom' ? customCriteriaName.trim() : selectedCriteria;
        if (!name) return;
        if (criteria.find(c => c.name.toLowerCase() === name.toLowerCase())) return;
        setCriteria(prev => [...prev, { name, values: [] }]);
        setSelectedCriteria('');
        setCustomCriteriaName('');
        setVariantsGenerated(false);
    };

    const handleRemoveCriteria = (name) => {
        setCriteria(prev => prev.filter(c => c.name !== name));
        setValueInputs(prev => { const n = { ...prev }; delete n[name]; return n; });
        setVariantsGenerated(false);
        setVariants([]);
    };

    const handleAddValue = (criteriaName) => {
        const val = (valueInputs[criteriaName] || '').trim();
        if (!val) return;
        setCriteria(prev => prev.map(c =>
            c.name === criteriaName && !c.values.includes(val)
                ? { ...c, values: [...c.values, val] }
                : c
        ));
        setValueInputs(prev => ({ ...prev, [criteriaName]: '' }));
        setVariantsGenerated(false);
        setVariants([]);
    };

    const handleRemoveValue = (criteriaName, val) => {
        setCriteria(prev => prev.map(c =>
            c.name === criteriaName
                ? { ...c, values: c.values.filter(v => v !== val) }
                : c
        ));
        setVariantsGenerated(false);
        setVariants([]);
    };

    // ─── Generate Variants ─────────────────────────────────────────────────────

    const generateVariants = () => {
        const activeCriteria = criteria.filter(c => c.values.length > 0);
        if (activeCriteria.length === 0) return;

        // Cartesian product
        let combinations = [{}];
        activeCriteria.forEach(({ name, values }) => {
            combinations = combinations.flatMap(combo =>
                values.map(val => ({ ...combo, [name]: val }))
            );
        });

        const generated = combinations.map((combo, i) => ({
            id: `var_${Date.now()}_${i}`,
            combination: combo,
            label: Object.values(combo).join(' / '),
            price: '',
            profit: '',
            discount: '',
            is_active: true
        }));

        setVariants(generated);
        setVariantsGenerated(true);
    };

    // ─── Variant Field Updates ─────────────────────────────────────────────────

    const handleVariantChange = (id, field, value) => {
        setVariants(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
    };

    const toggleVariantActive = (id) => {
        setVariants(prev => prev.map(v => v.id === id ? { ...v, is_active: !v.is_active } : v));
    };

    // ─── Tags ──────────────────────────────────────────────────────────────────

    const handleAddTag = () => {
        if (tagInput.trim() && !tagNames.includes(tagInput.trim())) {
            setTagNames(prev => [...prev, tagInput.trim()]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tag) => setTagNames(prev => prev.filter(t => t !== tag));

    // ─── Images ───────────────────────────────────────────────────────────────

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImage(prev => [...prev, ...files]);
    };

    const handleRemoveImage = (index) => setImage(prev => prev.filter((_, i) => i !== index));

    // ─── Submit ────────────────────────────────────────────────────────────────

    const resetForm = () => {
        setProductData({
            category: '',
            subCategory: '',
            productName: '',
            productNameBn: '',
            productDescription: '',
            productDescriptionBn: '',
            productSupplier: '',
            deliveryTime: ''
        });
        setSellerId('');
        setCriteria([]);
        setSelectedCriteria('');
        setCustomCriteriaName('');
        setValueInputs({});
        setVariants([]);
        setVariantsGenerated(false);
        setTagNames([]);
        setTagInput('');
        setImage([]);
        setFormKey(k => k + 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('category', productData.category);
        formData.append('subCategory', productData.subCategory);
        formData.append('productName', productData.productName);
        formData.append('productNameBn', productData.productNameBn);
        formData.append('productDescription', productData.productDescription);
        formData.append('productDescriptionBn', productData.productDescriptionBn);
        formData.append('productSupplier', productData.productSupplier);
        formData.append('deliveryTime', productData.deliveryTime);
        formData.append('tags', JSON.stringify(tagNames));
        formData.append('criteria', JSON.stringify(criteria));
        formData.append('variants', JSON.stringify(variants));

        if (sellerId) {
            const selectedSeller = sellers.find(s => s._id === sellerId);
            formData.append('sellerId', sellerId);
            formData.append('sellerName', selectedSeller?.name || '');
            formData.append('sellerPhone', selectedSeller?.phone || '');
        }

        Array.from(image).forEach(file => formData.append('mainPics', file));

        try {
            const response = await fetch(`${base_url}/addproduct`, { method: 'POST', body: formData });
            if (response.ok) {
                Swal.fire({ title: 'Product Added!', text: 'Successfully added a new product.', icon: 'success' });
                resetForm();
            } else {
                alert('Failed to add product');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the product');
        }
    };

    // ─── Available criteria options (exclude already added) ───────────────────
    const availablePresets = PRESET_CRITERIA.filter(p => !criteria.find(c => c.name === p));

    return (
        <div className="w-full flex flex-col gap-6 p-6 bg-gray-50 ">
            <div className="text-2xl font-semibold text-gray-800">Add Product</div>

            <div className="grid grid-cols-1  gap-6"   style={{ gridTemplateColumns: '20% 80%' }}>

                {/* ── LEFT COLUMN: Basic Info ── */}
                <div className="flex flex-col gap-4">
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-4">
                        <p className="font-medium text-gray-700">Basic Information</p>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm text-gray-500">Category</span>
                            <select className="flinselect" value={productData.category}
                                onChange={e => setProductData({ ...productData, category: e.target.value })}>
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c._id} value={c.catname}>{c.catname}</option>)}
                            </select>
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm text-gray-500">Subcategory</span>
                            <select className="flinselect" value={productData.subCategory}
                                disabled={!productData.category}
                                onChange={e => setProductData({ ...productData, subCategory: e.target.value })}>
                                <option value="">Select Subcategory</option>
                                {filteredSubcategories.map(s => <option key={s._id} value={s.subcat}>{s.subcat}</option>)}
                            </select>
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm text-gray-500">Product Name</span>
                            <input type="text" className="flin" placeholder="Type here"
                                value={productData.productName}
                                onChange={e => setProductData({ ...productData, productName: e.target.value })} />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm text-gray-500">Product Name (Bangla)</span>
                            <input type="text" className="flin" placeholder="বাংলায় প্রোডাক্টের নাম"
                                value={productData.productNameBn}
                                onChange={e => setProductData({ ...productData, productNameBn: e.target.value })} />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm text-gray-500">Supplier</span>
                            <input type="text" className="flin" placeholder="Type here"
                                value={productData.productSupplier}
                                onChange={e => setProductData({ ...productData, productSupplier: e.target.value })} />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm text-gray-500">Delivery Time</span>
                            <input type="text" className="flin" placeholder="e.g. 3-5 days"
                                value={productData.deliveryTime}
                                onChange={e => setProductData({ ...productData, deliveryTime: e.target.value })} />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm text-gray-500">Assign to Seller (optional)</span>
                            <select className="flinselect" value={sellerId}
                                onChange={e => setSellerId(e.target.value)}>
                                <option value="">— House product (no seller) —</option>
                                {sellers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                            </select>
                        </label>

                        {/* Tags */}
                        <div className="flex flex-col gap-2">
                            <span className="text-sm text-gray-500">Tags</span>
                            <div className="flex gap-2">
                                <input type="text" className="flin flex-1" placeholder="Add tag"
                                    value={tagInput}
                                    onChange={e => setTagInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())} />
                                <button type="button" className="btn btn-sm" onClick={handleAddTag}>Add</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {tagNames.map(tag => (
                                    <span key={tag} className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                                        {tag}
                                        <button type="button" onClick={() => handleRemoveTag(tag)}
                                            className="text-gray-400 hover:text-red-500 leading-none">×</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-4">
                        <p className="font-medium text-gray-700">Variant Criteria</p>

                        {/* Add criteria row */}
                        <div className="flex gap-2">
                            <select
                                className="flinselect flex-1"
                                value={selectedCriteria}
                                onChange={e => setSelectedCriteria(e.target.value)}
                            >
                                <option value="">Select criteria</option>
                                {availablePresets.map(p => <option key={p} value={p}>{p}</option>)}
                                <option value="Custom">+ Custom</option>
                            </select>
                            <button type="button" className="btn btn-sm" onClick={handleAddCriteria}>Add</button>
                        </div>

                        {selectedCriteria === 'Custom' && (
                            <input type="text" className="flin" placeholder="Enter criteria name"
                                value={customCriteriaName}
                                onChange={e => setCustomCriteriaName(e.target.value)} />
                        )}

                        {/* Criteria list with value inputs */}
                        <div className="flex flex-col gap-4">
                            {criteria.map(c => (
                                <div key={c.name} className="border border-gray-100 rounded-xl p-3 flex flex-col gap-2 bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-sm text-gray-700">{c.name}</span>
                                        <button type="button" onClick={() => handleRemoveCriteria(c.name)}
                                            className="text-xs text-red-400 hover:text-red-600">Remove</button>
                                    </div>

                                    {/* Add value */}
                                    <div className="flex gap-2">
                                        <input type="text" className="flin flex-1 text-sm" placeholder={`Add ${c.name} value`}
                                            value={valueInputs[c.name] || ''}
                                            onChange={e => setValueInputs(prev => ({ ...prev, [c.name]: e.target.value }))}
                                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddValue(c.name))} />
                                        <button type="button" className="btn btn-sm text-xs" onClick={() => handleAddValue(c.name)}>Add</button>
                                    </div>

                                    {/* Values pills */}
                                    <div className="flex flex-wrap gap-1">
                                        {c.values.map(val => (
                                            <span key={val} className="flex items-center gap-1 bg-white border border-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                                                {val}
                                                <button type="button" onClick={() => handleRemoveValue(c.name, val)}
                                                    className="text-gray-300 hover:text-red-400">×</button>
                                            </span>
                                        ))}
                                        {c.values.length === 0 && (
                                            <span className="text-xs text-gray-400 italic">No values yet</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Generate button */}
                        {criteria.some(c => c.values.length > 0) && (
                            <button
                                type="button"
                                onClick={generateVariants}
                                className="btn btn-sm w-full bg-blue-600 text-white hover:bg-blue-700 border-0 mt-2"
                            >
                                ⚡ Generate Variants ({criteria.filter(c => c.values.length > 0).reduce((acc, c) => acc * c.values.length, 1)} combinations)
                            </button>
                        )}
                    </div>
                    {/* Images */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-3">
                        <p className="font-medium text-gray-700">Product Images</p>
                        <label className="cursor-pointer">
                            <input type="file" className="hidden" name="mainPics" multiple onChange={handleImageChange} />
                            <div className="flex items-center gap-2 border border-dashed border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-500 hover:bg-gray-50 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Click to select images
                            </div>
                        </label>
                        {image.length > 0 && (
                            <div className="flex flex-wrap gap-3">
                                {image.map((img, i) => (
                                    <div key={i} className="relative group border rounded-xl overflow-hidden w-20 h-20">
                                        <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover" />
                                        <button onClick={() => handleRemoveImage(i)}
                                            className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition">×</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── MIDDLE COLUMN: Criteria Builder ── */}
                <div className="flex flex-col gap-4">
                  

                    {/* Description */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-5">
                        <p className="font-medium text-gray-700 mb-3">Package Details / Description</p>
                        <RichTextEditor
                            key={`desc-${formKey}`}
                            name="productDescription"
                            value={productData.productDescription}
                            onChange={value => setProductData(prev => ({ ...prev, productDescription: value }))}
                            className="bg-white rounded-lg w-full h-56"
                        />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl p-5">
                        <p className="font-medium text-gray-700 mb-3">Package Details / Description (Bangla)</p>
                        <RichTextEditor
                            key={`descbn-${formKey}`}
                            name="productDescriptionBn"
                            value={productData.productDescriptionBn}
                            onChange={value => setProductData(prev => ({ ...prev, productDescriptionBn: value }))}
                            className="bg-white rounded-lg w-full h-56"
                        />
                    </div>
                      {/* ── RIGHT COLUMN: Variants Table ── */}
                <div className="flex flex-col gap-4">
                    {variantsGenerated && variants.length > 0 ? (
                        <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <p className="font-medium text-gray-700">Generated Variants</p>
                                <span className="text-xs text-gray-400">{variants.length} variants</span>
                            </div>

                            {/* Header */}
                            <div
                                className="grid gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b pb-2"
                                style={{ gridTemplateColumns: '30% 20% 20% 20% 10%' }}
                            >
                                <span>Variant</span>
                                <span>Price</span>
                                <span>Profit</span>
                                <span>Discount</span>
                                <span>Active</span>
                            </div>

                            {/* Rows */}
                            <div className="flex flex-col gap-2 max-h-[520px] overflow-y-auto pr-1">
                                {variants.map(v => (
                                    <div
                                        key={v.id}
                                        className={`grid gap-2 items-center py-2 border-b border-gray-50 transition-opacity ${!v.is_active ? 'opacity-40' : ''}`}
                                             style={{ gridTemplateColumns: '30% 20% 20% 20% 10%' }}
                                    >
                                        <span className="text-sm text-gray-700 font-medium truncate" title={v.label}>{v.label}</span>

                                        <input
                                            type="number"
                                            placeholder="0"
                                            className="flin text-sm px-2 py-1"
                                            value={v.price}
                                            onChange={e => handleVariantChange(v.id, 'price', e.target.value)}
                                            disabled={!v.is_active}
                                        />
                                        <input
                                            type="number"
                                            placeholder="0"
                                            className="flin text-sm px-2 py-1"
                                            value={v.profit}
                                            onChange={e => handleVariantChange(v.id, 'profit', e.target.value)}
                                            disabled={!v.is_active}
                                        />
                                        <input
                                            type="number"
                                            placeholder="0%"
                                            className="flin text-sm px-2 py-1"
                                            value={v.discount}
                                            onChange={e => handleVariantChange(v.id, 'discount', e.target.value)}
                                            disabled={!v.is_active}
                                        />

                                        {/* Active toggle */}
                                        <input
                                            type="checkbox"
                                            className="toggle toggle-success toggle-sm"
                                            checked={v.is_active}
                                            onChange={() => toggleVariantActive(v.id)}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Summary */}
                            <div className="flex gap-4 text-xs text-gray-400 pt-1 border-t">
                                <span className="text-green-500 font-medium">{variants.filter(v => v.is_active).length} active</span>
                                <span>{variants.filter(v => !v.is_active).length} inactive</span>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center justify-center text-gray-400 gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                            <p className="text-sm">Add criteria & values, then click Generate Variants</p>
                        </div>
                    )}
                </div>
                </div>

              

            </div>

            {/* Submit */}
            <div className="flex justify-center pb-6">
                <button className="btn btn-sm w-[400px]" onClick={handleSubmit}>
                    Add Product
                </button>
            </div>
        </div>
    );
};

export default PAddproducts;