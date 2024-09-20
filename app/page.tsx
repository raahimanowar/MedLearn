import Link from 'next/link'
import { FaUserMd, FaBaby, FaFemale, FaAllergies, FaBrain } from 'react-icons/fa'
import { FaHeartPulse } from "react-icons/fa6";
import { IoMaleFemale } from "react-icons/io5";
import { GiBrokenBone } from "react-icons/gi";

const specialties = [
  { name: 'General Physician', icon: FaUserMd, description: 'Cold, flu, fever, vomiting, infections, headaches or any other general health issues.', href: '/test/general' },
  { name: 'Pediatrics', icon: FaBaby, description: "Any children's health related issues including physical, behavior and mental health.", href: '/test/pediatrics' },
  { name: 'Gynae & Obs', icon: FaFemale, description: "Any woman's health related issues including pregnancy, menstruation, fertility issues, hormone disorders etc.", href: '/test/gynae' },
  { name: 'Dermatology', icon: FaAllergies, description: 'Treatment of diseases related to skin, hair and nails and some cosmetic problems.', href: '/test/dermatology' },
  { name: 'Cardiology', icon: FaHeartPulse, description: 'Treatment of diseases related to the heart, blood vessels and blood.', href: '/test/cardiology' },
  { name: 'Neurology', icon: FaBrain, description: 'Treatment of diseases related to the brain, nervous system and mental health.', href: '/test/neurology' },
  { name: 'Urology', icon: IoMaleFemale, description: 'Treatment of diseases related to the male & female urinary-tract system', href: '/test/urology' },
  { name: 'Orthopedics', icon: GiBrokenBone, description: 'Treatment of bones, muscles, tendons, joints', href: '/test/orthopedics' },
]

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h2 className="text-3xl font-semibold text-secondary-800 mb-8 text-center">Test your medical knowledge</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {specialties.map((specialty) => (
            <Link key={specialty.name} href={specialty.href} className="block p-6 bg-white rounded-lg shadow-soft hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4 mx-auto">
                <specialty.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-3 text-center">{specialty.name}</h3>
              <p className="text-secondary-600 text-center">{specialty.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}