import { Cards } from '../components/cards'
import Graphics from '../components/graphics'
import React from 'react'
import { getAgricultureData, getIaData } from '@/utils/supabaseClient'
import { log } from 'console'


interface SensorData {
  date: string;
  temperatura: number;
  umidadeAr: number;
  umidadeSolo: number;
}

interface Feedback {
  acuracia: number;

}


export default async function Home() {
  //const latest = data[0];
    const {latest, history} = await getAgricultureData()
    const feedback = await getIaData()

  if (feedback.length > 0) {
    console.log(feedback[0].acuracia)
    console.log(feedback[0].saudeFolha)
  }

  const cardData = [
    { name: 'Temperatura', value: latest.temperatura, unit: '°C' },
    { name: 'Umidade do Ar', value: latest.umidadeAr, unit: '%' },
    { name: 'Umidade do Solo', value: latest.umidadeSolo, unit: '%' }

  ];
  //const chartData = data.map((item) => ({
    //name: item.date,
    //temperatura: item.temperatura,
    //umidadeAr: item.umidadeAr,
    //umidadeSolo: item.umidadeSolo,
  //}));
  const chartData = history.map((item, index) => ({
    date: item.date,
    temperatura: item.temperatura,
    umidadeAr: item.umidadeAr,
    umidadeSolo: item.umidadeSolo,
  }))

  return (
    <main>
      <div className="bg-white m-15 p-10 rounded-xl">
        <header className="flex flex-col md:flex-row md:justify-between md:items-center">
          <h1 className="font-montserrat font-bold text-3xl">
            Monitoramento de Agricultura
          </h1>
          <span className="font-montserrat text-md font-medium">
            Última atualização: {latest.date}
          </span>
        </header>

        <div className="flex flex-col md:block-row md:justify-between">
          <section className="border-2 border-gray-300 p-7 mt-10 flex flex-col gap-7 w-full">
            <h2 className="font-bold text-xl">Dados recentes</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {cardData.map((item, index) => (
                <Cards key={index} name={item.name} value={item.value} unit={item.unit} />
              ))}
              <div className='flex justify-center gap-5'>
                <Cards name='Acurácia' value={feedback[0].acuracia} unit='%'/>
                <Cards name='Saudável?' indicatorColor={feedback[0]?.saudeFolha === 'Healthy' ? 'green' : 'red'}/>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="font-bold text-xl mb-4">Histórico</h2>
              <Graphics data={chartData} />
            </div>
          </section>

          <section className="border-2 border-gray-300 p-7 mt-10 w-full h-full">
          <iframe
            src="" // URL do Dify
            width="100%"
            height="1000"
            title="DifyChat"
              
          >
        </iframe>
          </section>
        </div>
      </div>
    </main>
  );
}
