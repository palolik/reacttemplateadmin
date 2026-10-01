
import Swal from "sweetalert2";
import { base_url } from "../../../config/config";
import { useEffect, useState } from "react";


const Suppliers = () => {

    const[suppliers, setSuppliers] = useState([]);
    const[editingSupplier, setEditingSupplier] = useState(null);

useEffect(()=>{
    fetch(`${base_url}/suppliers`)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        setSuppliers(data);
    })
},[]);

  const handleEdit = (supplier) => {
        setEditingSupplier(supplier);
        
         document.getElementById("my_modal_4").showModal();

    }

  const handleDelete = async(_id) =>{
      console.log(_id);
    Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        }).then((result) => {


            if(result.isConfirmed) {
         fetch(`${base_url}/delsupplier/${_id}`, {
        method: "DELETE"
    })
     const data = response.json()

    .then((res) => res.json())
    .then((data) => {
        if(data.deletedCount>0){
             Swal.fire("Deleted!", "The supplier has been deleted.", "success");
            setSuppliers((prev) => prev.filter((supplier) => supplier._id !==_id));
             
            } else{
                Swal.fire("Error!", "Supplier was not deleted.", "error");
            }
    })

    .catch((error) => {
                console.error("Error deleting supplier:", error);
                Swal.fire("Error!", "Unexpected error occurred.", "error");
              });
   
                
            }
        })

   

   

    

   
    }
  
  

    const handleSubmit = async(event) => {
        event.preventDefault();
           console.log("SUBMIT FIRED");

  


        const form = event.target;

        const supplierData = {
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            phone: form.phone.value.trim(),
            address: form.address.value.trim(),
            location: form.location.value.trim(),
      
            
        }
         console.log(supplierData);

         //  Create: Send data to backend
  const response = await fetch(`${base_url}/addsupplier`,{
    method:'POST',
    headers:{
        'Content-type':"application/json"
    },
    body:JSON.stringify(supplierData)
  });

  const data = await response.json();
   if (response.ok) {
    const updatedResponse = await fetch(`${base_url}/suppliers`);
    const updatedSuppliers = await updatedResponse.json();

    setSuppliers(updatedSuppliers);
   }
      


  console.log(data);
   
 


  closeForm();
      
   
         if (editingSupplier) {
           Swal.fire("Updated!", "Supplier updated successfully.", "success");
         } else if (data.insertedId) {
           Swal.fire("Added!", "New Supplier added successfully.", "success");
         }

        
    }


const closeForm =() =>{
   
   const dialog = document.getElementById("my_modal_4");
    const form = dialog.querySelector("form");

    form.reset();
    dialog.close();
}
   

    return (
        <div>
            <h2 className="text-2xl mt-4 mx-4">Suppliers</h2>
            <div className="my-4 px-4 flex justify-end items-center ">
                <button className="bg-black text-sm text-white p-2  rounded-2xl" onClick=
                {() => {
                    setEditingSupplier(null);
                    document.getElementById('my_modal_4').showModal();
                }

                }>+ Add New Supplier</button>
               
               
                {/* ====Floating Form Modal=== */}
                <dialog id="my_modal_4" className="modal">
                    <div className="modal-box w-full">
                        <button
                            type="button"
                            onClick={closeForm}
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕
                        </button>

                     

                       <h3 className="text-2xl text-center">
                        {editingSupplier ? "Edit Supplier" :  "Add New Supplier"}
                       </h3>

                        <div className="modal-action">
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    className="priinput"
                                    defaultValue={editingSupplier?.name ||""}
                                    required />

                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Phone Number"
                                    className="priinput"
                                     defaultValue={editingSupplier?.phone ||""}
                                    required />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    className="priinput"
                                     defaultValue={editingSupplier?.email || ""}
                                    required />
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="Location"
                                    className="priinput"
                                    defaultValue={editingSupplier?.location || ""}
                                    required />
                                <textarea
                                    name="address"
                                    placeholder="Address"
                                    defaultValue={editingSupplier?.address || ""}
                                    className="textarea textarea-bordered w-full md:col-span-2"
                                    required
                                />
                        

                                <button type="submit" className="pributton md:col-span-2">
                                    {editingSupplier? "Update Supplier" : "Add Supplier"}
                                </button>

                            </form>



                        </div>
                    </div>
                </dialog>


            </div>



            {/* Supplier Table */}
            <div className="overflow-x-auto">
                <table className="table w-full border">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Location On Map</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            suppliers.map((supplier,index)=>(
                        <tr key={supplier._id} className="text-center border-b">
                            <th>{index + 1}</th>
                            <td>{supplier.name}</td>
                            <td>{supplier.address}</td>
                            <td>{supplier.phone}</td>
                            <td>{supplier.email}</td>
                            <td>{supplier.location}</td>
                             <td>
                              <div className="flex justify-center gap-2">
                                <button onClick={() => handleEdit(supplier)} className="btn btn-xs btn-warning">Edit</button>
                                <button 
                                onClick={() => handleDelete(supplier._id)}                                
                                className="btn btn-xs btn-error">Delete</button>
                              </div>
                            </td>
                        
                        
                        
                        </tr>
                            ))
                        }
                        {/* row 1 */}
                      
                        {/* row 2 */}

                    </tbody>
                </table>
            </div>
           





        </div>

    )
}

export default Suppliers