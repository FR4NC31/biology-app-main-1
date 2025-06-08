import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightCircle, ChevronDown, ChevronUp } from 'lucide-react'

const Lesson = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const lesson = {
    title: 'Lesson: Cells - The Basic Unit of Life',
    sections: [
      {
        heading: '1. Cell Theory',
        description:
          'Cell Theory is a basic and important idea in biology that explains what living things are made of and how they function.',
        subheading: 'The Three Main Parts of Cell Theory:',
        bullets: [
          'All living things are made of one or more cells – Every plant, animal, or tiny organism (like bacteria) is made up of cells.',
          'The cell is the basic unit of life – Cells are the smallest part of an organism that can carry out life’s processes.',
          'All cells come from pre-existing cells – New cells are made when old cells divide.'
        ],
        note: 'Why is Cell Theory important?',
        subbullets: [
          'It shows that life is organized.',
          'It helps scientists understand diseases, growth, and reproduction.',
          'It is the foundation of modern biology and medicine.'
        ],
        videoUrl: 'https://www.youtube.com/embed/ogQyN4_ruUA?si=eDxiqdv26GeHtF4q',
      },
      {
        heading: '2. Cell Structure and Functions',
        description:
          'A cell is like a tiny factory. Each part (organelle) has a special job to help the cell function properly.',
        table: {
          headers: ['Cell Part', 'Function (What it does)', 'Found in Plant/Animal?'],
          rows: [
            ['Cell Membrane', 'Controls what goes in and out of the cell (gatekeeper)', 'Both'],
            ['Cytoplasm', 'Jelly-like fluid where organelles are found', 'Both'],
            ['Nucleus', 'The "brain" of the cell; controls activities', 'Both'],
            ['Mitochondria', 'Powerhouse; gives energy to the cell', 'Both'],
            ['Vacuole', 'Stores water, food, and waste', 'Large in plants, small in animals'],
            ['Chloroplast', 'Makes food using sunlight (photosynthesis)', 'Plant only'],
            ['Cell Wall', 'Gives shape and support to plant cells', 'Plant only'],
            ['Ribosomes', 'Makes proteins', 'Both'],
            ['Endoplasmic Reticulum (ER)', 'Transports materials in the cell (like a highway)', 'Both'],
            ['Golgi Apparatus', 'Packages and delivers proteins (like a post office)', 'Both'],
            ['Lysosomes', 'Breaks down waste (clean-up crew)', 'Mostly in animal cells']
          ]
        },
        videoUrl: 'https://www.youtube.com/embed/URUJD5NEXC8?si=jj43KNtyx41NrlS3',
      },
      {
        heading: '3. Prokaryotic vs Eukaryotic Cells',
        description:
          'Cells are classified into two major types based on their internal structure: Prokaryotic and Eukaryotic.',
        table: {
          headers: ['Feature', 'Prokaryotic Cells', 'Eukaryotic Cells'],
          rows: [
            ['Nucleus', 'No nucleus', 'Has nucleus'],
            ['Size', 'Small (1-10 µm)', 'Larger (10-100 µm)'],
            ['Complexity', 'Simple', 'Complex'],
            ['Examples', 'Bacteria, Archaea', 'Animals, Plants, Fungi, Protists'],
            ['Organelles', 'No membrane-bound organelles', 'Has membrane-bound organelles'],
            ['DNA Location', 'Floating freely in cytoplasm', 'Inside the nucleus'],
            ['Cell Division', 'Binary fission', 'Mitosis or meiosis']
          ]
        },
        videoUrl: 'https://www.youtube.com/embed/-ivGgYgAB0A?si=VCY5Dy-AQsm6GAya',
      },
      {
        heading: '4. Cell Types',
        description:
          'Cells differ in structure and function depending on the organism. Here are the major types of cells found in living things:',
        table: {
          headers: ['Cell Type', 'Key Features', 'Found In'],
          rows: [
            ['Animal Cell', 'No cell wall, no chloroplasts, small vacuoles', 'Animals'],
            ['Plant Cell', 'Cell wall, chloroplasts, large central vacuole', 'Plants'],
            ['Fungal Cell', 'Cell wall made of chitin, no chloroplasts', 'Fungi'],
            ['Protist Cell', 'Unicellular, eukaryotic, features vary widely', 'Protists']
          ]
        },
        videoUrl: 'https://www.youtube.com/embed/192M4oDLTdc?si=c-LGMD7hZxRE-1pf',
      },
      {
        heading: '5. Cell Modifications',
        description:
          'Some cells have special structures that allow them to perform specific functions efficiently. These modifications help cells adapt to their roles in the body or environment.',
        table: {
          headers: ['Modification', 'Function', 'Example Cell'],
          rows: [
            ['Cilia and Flagella', 'Used for movement', 'Sperm cell, respiratory tract cells'],
            ['Microvilli', 'Increases surface area for absorption', 'Intestinal lining cells'],
            ['Root Hair', 'Absorbs water and minerals from soil', 'Root hair cell of plants'],
            ['Red Blood Cell Shape', 'Biconcave shape increases surface area for gas exchange', 'Red blood cells']
          ]
        },
        imageUrls: [
          'https://as2.ftcdn.net/v2/jpg/04/40/18/57/1000_F_440185740_awAQB1ctQsRaFyrsffgEuj0BlpeI6wPW.jpg',
          'https://as2.ftcdn.net/v2/jpg/03/17/04/71/1000_F_317047137_D9YtrBxxHWDwod3UePDs7p6Lbcy1h7Ek.jpg'
        ]
      }
    ]
  }

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="p-6 sm:p-8 min-h-screen bg-gradient-to-b from-blue-50 to-white font-sans">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-blue-700 mb-10">
        {lesson.title}
      </h2>

      {lesson.sections.map((section, index) => {
        const isOpen = openIndex === index

        return (
          <div
            key={index}
            className="w-full sm:w-3/4 mx-auto mb-4 bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => toggleSection(index)}
              className="w-full text-left p-4 flex items-center justify-between bg-blue-100 hover:bg-blue-200 transition"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-blue-800">
                {section.heading}
              </h3>
              {isOpen ? <ChevronUp className="text-blue-800" /> : <ChevronDown className="text-blue-800" />}
            </button>

            {/* Transition wrapper always rendered */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                isOpen ? 'max-h-[2000px] opacity-100 p-4 sm:p-5' : 'max-h-0 opacity-0 p-0'
              }`}
            >
              <div className="text-gray-800 text-sm sm:text-base space-y-4">
                {section.description && <p>{section.description}</p>}

                {section.subheading && <p className="font-semibold">{section.subheading}</p>}

                {section.bullets && (
                  <ul className="list-disc list-inside space-y-1">
                    {section.bullets.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                )}

                {section.note && <p className="font-semibold">{section.note}</p>}

                {section.subbullets && (
                  <ul className="list-disc list-inside space-y-1">
                    {section.subbullets.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                )}

                {section.table && (
                  <div className="overflow-x-auto border rounded-lg shadow-sm">
                    <table className="min-w-full text-left border-collapse text-sm sm:text-base">
                      <thead className="bg-blue-200 text-blue-900">
                        <tr>
                          {section.table.headers.map((header, i) => (
                            <th key={i} className="px-4 py-2 border whitespace-nowrap">{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.table.rows.map((row, i) => (
                          <tr key={i} className="odd:bg-white even:bg-gray-50">
                            {row.map((cell, j) => (
                              <td key={j} className="px-4 py-2 border whitespace-nowrap">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {section.videoUrl && (
                  <div className="w-full aspect-video">
                    <iframe
                      src={section.videoUrl}
                      title={`Video for ${section.heading}`}
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                    />
                  </div>
                )}

                {section.imageUrls?.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {section.imageUrls.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`Image for ${section.heading}`}
                        className="w-full h-auto rounded-md shadow-md transition-transform hover:scale-105"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}

      <div className="mt-8 text-center">
        <Link
          to="/activity"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-lg transition"
        >
          <span>Take Activity</span>
          <ArrowRightCircle className="w-5 h-5" />
        </Link>
      </div>
    </div>
  )
}

export default Lesson
