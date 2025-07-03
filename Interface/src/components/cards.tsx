interface CardsProps {
    name: string,
    value?: number,
    unit?: string,
    indicatorColor?: 'green' | 'red'  // Nova prop opcional
}

export function Cards(props: CardsProps){
    return (
            <div className="flex gap-10 p-5 border-2 rounded-2xl border-gray-300 min-w-[260px] justify-between">
                <h2 className="font-medium text-xl flex items-start">{props.name}</h2>

                {props.indicatorColor ? (
                // Se a cor do indicador foi passada, exibe a bolinha
                <span
                    className={`w-8 h-8 rounded-full ${props.indicatorColor === 'green' ? 'bg-green-500' : 'bg-red-500'}`}
                ></span>
            ) : (
                // Caso contrário, exibe valor e unidade normalmente
                <h2 className="font-bold text-4xl flex items-baseline">
                    {props.value}
                    {props.unit && (<span className="text-xl font-normal ml-1">{props.unit}</span>)}
                </h2>
            )}
        </div>
    )
}
