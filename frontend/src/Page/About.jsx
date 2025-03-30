import { useState } from "react";
import Navbar from "./../Components/Navbar";
import {
  UserCircleIcon,
  PhoneIcon,
  MailIcon,
  MessageCircleIcon,
  InstagramIcon,
  XIcon,
} from "lucide-react";

function Aboutpage() {
  const detailAbout = [
    {
      name: "Hannarong Boonyuen",
      studentId: 65056738,
      behaveorOf: "คณะเทคโนโลยีสารสนเทศ",
      branch: "เทคโนโลยีสารสนเทศ",
      university: "ศรีปทุม บางเขน",
      image: "/วายร้าย.JPG",
      Tel: "098-247-1872",
      Email: "hanarong.bon@spumail.net",
      Line: "kubguy_",
      Instagram: "_.kubgxy",
    },
    {
      name: "Thanakon Singkom",
      studentId: 65007905,
      behaveorOf: "คณะเทคโนโลยีสารสนเทศ",
      branch: "เทคโนโลยีสารสนเทศ",
      university: "ศรีปทุม บางเขน",
      image: "/Oak.jpg",
      Tel: "096-827-0214",
      Email: "thanakon.sin@spumail.net",
      Line: "iiisusoak_",
      Instagram: "thnk._.k",
    },
    {
      name: "Patarapisit Thongkerd",
      studentId: 65007912,
      behaveorOf: "คณะเทคโนโลยีสารสนเทศ",
      branch: "เทคโนโลยีสารสนเทศ",
      university: "ศรีปทุม บางเขน",
      image: "/Fourth.jpg",
      Tel: "085-829-4254",
      Email: "patarapisit.tho@spumail.net",
      Line: "fptrps_",
      Instagram: "ptrpssssss",
    },
  ];

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);

  const handleContactClick = (person) => {
    setSelectedPerson(person);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedPerson(null);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-blue-900 mb-4">
            G. รัชดา 44 เจอได้ทุกตัว
          </h1>
          <p className="text-lg text-gray-600">พบกับทีมงานของเรา</p>
        </div>

        <div className="max-w-[2000px]  mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[80px]">
          {detailAbout.map((person, index) => (
            <div
              key={index}
              className="group bg-white rounded-3xl shadow-lg overflow-hidden 
                       transform transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
            >
              <div className="relative">
                <img
                  src={person.image}
                  alt={`Image of ${person.name}`}
                  className="w-full h-[450px] object-cover transform transition-transform duration-300 
                           group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              <div className="p-6 text-center">
                <h2 className="text-2xl font-bold text-blue-800 mb-4">
                  {person.name}
                </h2>
                <button
                  onClick={() => handleContactClick(person)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl
                           transition-all duration-300 flex items-center justify-center space-x-2 
                           shadow-lg hover:shadow-blue-300/50"
                >
                  <UserCircleIcon className="w-5 h-5" />
                  <span>ติดต่อ</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal/Popup */}
      {isPopupOpen && selectedPerson && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 relative animate-fadeIn">
            <button
              onClick={closePopup}
              className="absolute top-6 right-6 text-white"
            >ปิด
              <XIcon className="w-6 h-6 text-gray-400  hover:text-gray-600 transition-colors" />
            </button>

            <div className="text-center mb-8">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <img
                  src={selectedPerson.image}
                  alt={`Image of ${selectedPerson.name}`}
                  className="w-full h-full object-cover rounded-2xl border-4 border-blue-100"
                />
              </div>
              <h2 className="text-3xl font-bold text-blue-800 mb-2">
                {selectedPerson.name}
              </h2>
            </div>

            {/* Student Information */}
            <div className="bg-blue-50 rounded-2xl p-6 mb-8 space-y-4">
              <div className="text-center mb-4">
                <p className="text-gray-600 mb-1">รหัสนักศึกษา</p>
                <p className="text-2xl font-bold text-blue-800">{selectedPerson.studentId}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">คณะ</p>
                  <p className="font-semibold text-blue-900">{selectedPerson.behaveorOf}</p>
                </div>
                <div>
                  <p className="text-gray-600">สาขา</p>
                  <p className="font-semibold text-blue-900">{selectedPerson.branch}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-gray-600">มหาวิทยาลัย</p>
                  <p className="font-semibold text-blue-900">{selectedPerson.university}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4 bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl
                            hover:from-blue-100 transition-colors">
                <PhoneIcon className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">{selectedPerson.Tel}</span>
              </div>
              <div className="flex items-center space-x-4 bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl
                            hover:from-blue-100 transition-colors">
                <MailIcon className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">{selectedPerson.Email}</span>
              </div>
              <div className="flex items-center space-x-4 bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl
                            hover:from-blue-100 transition-colors">
                <MessageCircleIcon className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">{selectedPerson.Line}</span>
              </div>
              <div className="flex items-center space-x-4 bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl
                            hover:from-blue-100 transition-colors">
                <InstagramIcon className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">{selectedPerson.Instagram}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Aboutpage;