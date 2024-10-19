import { assets } from "../../assets/assets";

const AddDoctor = () => {
  return (
    <form className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add doctor</p>
      <div className="bg-white px-8 py-8 border rounded-lg w-full max-w-7xl max-h-[80vh] overflow-y-scroll">
        <div className="flex items-center gap-4 mb-8 text-gray-500 ">
          <label htmlFor='doc-img'>
            <img className="w-16 bg-gray-100 rounded-full cursor-pointer" src={assets.upload_area} alt='' />
          </label>
          <input type='file' id='doc-img' hidden />
          <p>
            Upload doctor <br /> picture
          </p>
        </div>
        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600 ">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor name</p>
              <input className="w-full p-3 rounded-lg bg-[#eaeaea] focus:outline-none focus:ring-2 focus:ring-primary text-base" type='text' placeholder='Name' required />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p className="flex-1 flex flex-col gap-1">Doctor email</p>
              <input className="w-full p-3 rounded-lg bg-[#eaeaea] focus:outline-none focus:ring-2 focus:ring-primary text-base" type='email' placeholder='Email' required />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p className="flex-1 flex flex-col gap-1">Doctor passowrd</p>
              <input className="w-full p-3 rounded-lg bg-[#eaeaea] focus:outline-none focus:ring-2 focus:ring-primary text-base" type='text' placeholder='Password' required />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Experience</p>
              <select className="w-full p-3 rounded-lg bg-[#eaeaea] focus:outline-none focus:ring-2 focus:ring-primary text-base" name='' id=''>
                <option value='1 Year'>1 Year</option>
                <option value='2 Year'>2 Year</option>
                <option value='3 Year'>3 Year</option>
                <option value='4 Year'>4 Year</option>
                <option value='5 Year'>5 Year</option>
                <option value='6 Year'>6 Year</option>
                <option value='7 Year'>7 Year</option>
                <option value='8 Year'>8 Year</option>
                <option value='9 Year'>9 Year</option>
                <option value='10 Year'>10 Year</option>
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor fees</p>
              <input className="w-full p-3 rounded-lg bg-[#eaeaea] focus:outline-none focus:ring-2 focus:ring-primary text-base" type='number' placeholder='Fee' required />
            </div>
          </div>
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Speciality</p>
              <select className="w-full p-3 rounded-lg bg-[#eaeaea] focus:outline-none focus:ring-2 focus:ring-primary text-base" name='' id=''>
                <option value='General physician'>General physician</option>
                <option value='Gynecologist'>Gynecologist</option>
                <option value='Dermatologist'>Dermatologist</option>
                <option value='Pediatricians'>Pediatricians</option>
                <option value='Neurologist'>Neurologist</option>
                <option value='Gastroenterologist'>Gastroenterologist</option>
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor education</p>
              <input className="w-full p-3 rounded-lg bg-[#eaeaea] focus:outline-none focus:ring-2 focus:ring-primary text-base" type='text' placeholder='Education' required />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Address</p>
              <input className="w-full p-3 rounded-lg bg-[#eaeaea] focus:outline-none focus:ring-2 focus:ring-primary text-base" type='text' placeholder='Address 1' required />
              <input className="w-full p-3 rounded-lg bg-[#eaeaea] focus:outline-none focus:ring-2 focus:ring-primary text-base" type='text' placeholder='Address 2' required />
            </div>
          </div>
        </div>
        <div>
          <p className="mt-4 mb-2">About doctor</p>
          <textarea className="w-full p-3 rounded-lg bg-[#eaeaea] focus:outline-none focus:ring-2 focus:ring-primary text-base" placeholder='Write about doctor' rows={5} required />
        </div>
        <button className="bg-primary px-10 py-3 text-white mt-4 rounded-full">Add doctor</button>
      </div>
    </form>
  );
};

export default AddDoctor;
