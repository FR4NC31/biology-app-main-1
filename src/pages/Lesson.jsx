import { useParams, Link } from 'react-router-dom'
import { ArrowRightCircle } from 'lucide-react'

const Lesson = () => {
  const { id } = useParams()

  const lessonContent = {
    1: {
      title: 'Lesson 1: Cells - The Basic Unit of Life',
      sections: [
        {
          heading: '1.1 What is a Cell?',
          text: 'Cells are the smallest unit of life that can carry out all life processes. Every living organism is made up of cells, whether it is a tiny bacterium or a blue whale. Cells come in two main types: prokaryotic and eukaryotic.'
        },
        {
          heading: '1.2 Cell Types',
          text: 'Prokaryotic cells: These are simple cells without a nucleus. Example: bacteria.\nEukaryotic cells: These have a nucleus and other organelles. Found in animals, plants, fungi, and protists.'
        },
        {
          heading: '1.3 Cell Organelles and Their Functions',
          text: 'Nucleus: Control center of the cell, contains DNA.\nCell membrane: Controls what enters and exits the cell.\nCytoplasm: Gel-like fluid where cell processes occur.\nMitochondria: Powerhouse of the cell, produces energy.\nRibosomes: Make proteins.\nGolgi Apparatus: Packages and ships materials.\nLysosomes: Break down waste and damaged organelles.\nVacuoles: Storage for water, food, and waste.\nChloroplasts (plant cells only): Site of photosynthesis.'
        },
        {
          heading: '1.4 Cell Theory',
          text: '1. All living things are made of cells. \n2. Cells are the basic unit of life.\n3. All cells come from pre-existing cells.'
        }
      ]
    },
    2: {
      title: 'Lesson 2: Genetics',
      sections: [
        {
            heading: '2.1 What is Genetics?',
            text: `Genetics is the study of heredity, which explains how traits are passed from parents to offspring. It helps us understand why organisms look and behave the way they do.`
        },
        {
            heading: '2.2 DNA and Genes',
            text: `DNA (Deoxyribonucleic Acid) is a molecule that carries the genetic instructions for life. Segments of DNA are called genes, which determine specific traits like eye color or blood type.`
        },
        {
            heading: '2.3 Alleles and Traits',
            text: `Alleles are different versions of a gene. A trait is a specific characteristic, like height or hair color. The combination of alleles determines the trait shown.`
        },
        {
            heading: '2.4 Dominant and Recessive Genes',
            text: `A dominant allele shows its effect even if only one copy is present (e.g., Tt or TT for tall). A recessive allele only shows its effect if both copies are the same (e.g., tt for short).`
        },
        {
            heading: '2.5 Genotype and Phenotype',
            text: `Genotype refers to the genetic makeup (e.g., Aa or aa). Phenotype is the observable trait (e.g., tall or short).`
        },
        {
            heading: '2.6 Gregor Mendel’s Experiments',
            text: `Gregor Mendel used pea plants to discover how traits are inherited. He is known as the Father of Modern Genetics.`
        },
        {
            heading: '2.7 Punnett Squares',
            text: `Punnett squares are tools used to predict the outcome of genetic crosses. They help determine the probability of offspring inheriting certain traits.`
        },
        {
            heading: '2.8 Homozygous and Heterozygous',
            text: `An organism is homozygous if it has two identical alleles (e.g., TT or tt), and heterozygous if it has two different alleles (e.g., Tt).`
        },
        {
            heading: '2.9 Chromosomes and Sex Determination',
            text: `Humans have 23 pairs of chromosomes. The 23rd pair determines sex: XX for female, XY for male.`
        },
        {
            heading: '2.10 Mutations',
            text: `Mutations are changes in DNA. Some are harmless, while others may cause diseases or create genetic diversity.`
        }
      ]
    },
      3: {
      title: 'Lesson 3: Heredity',
      sections: [
        {
          heading: '3.1 What is Heredity?',
          text: `Heredity is the passing of traits from parents to their offspring through genes. It explains why children often resemble their parents.`
        },
        {
          heading: '3.2 Role of DNA in Heredity',
          text: `DNA carries genetic information that is inherited. Each parent contributes half of the offspring’s DNA, which influences traits.`
        },
        {
          heading: '3.3 Mendelian Inheritance',
          text: `Gregor Mendel discovered how traits are inherited in predictable patterns using pea plants. His principles laid the foundation for heredity.`
        },
        {
          heading: '3.4 Traits and Inheritance Patterns',
          text: `Some traits follow dominant-recessive patterns, while others show incomplete dominance, codominance, or are influenced by multiple genes (polygenic).`
        },
        {
          heading: '3.5 Hereditary Disorders',
          text: `Certain genetic mutations can be passed down, causing disorders like cystic fibrosis, sickle cell anemia, or hemophilia.`
        },
        {
          heading: '3.6 Importance of Studying Heredity',
          text: `Understanding heredity helps in genetic counseling, disease prediction, and improving crops and livestock through selective breeding.`
        }
      ]
    }
  }

  const lesson = lessonContent[id] || { title: `Lesson ${id}`, sections: [{ heading: 'Coming Soon', text: 'Lesson not available yet.' }] }

  return (
    <div className="p-6 sm:p-8 min-h-screen min-w-screen bg-gray-100 flex flex-col items-center">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-blue-700 max-w-xl">{lesson.title}</h2>
      
      {lesson.sections.map((section, index) => (
        <div 
          key={index} 
          className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mb-6 bg-white p-4 rounded shadow"
        >
          <h3 className="text-lg sm:text-xl font-semibold mb-2 text-green-600">{section.heading}</h3>
          <pre className="whitespace-pre-wrap text-gray-800 text-sm sm:text-base">{section.text}</pre>
        </div>
      ))}

      <div className="mt-8 text-center">
       <Link 
        to={`/activity/${id}`}
        className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 font-semibold px-5 py-3 rounded-lg"
      >
        <span className='text-white'>Take Activity</span> <ArrowRightCircle className="w-5 h-5 text-white" />
      </Link>
      </div>
    </div>
  )
}

export default Lesson
