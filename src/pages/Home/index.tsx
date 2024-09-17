import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@services/firebase";
import { ListProps } from "./@types";
import { tv, type VariantProps  } from 'tailwind-variants';
 
const th = tv({
    base: 'flex items-center h-10 text-slate-100 text-sm font-normal',
});

type ThProps = VariantProps<typeof th> & {
    children: React.ReactNode
    className?: string
};

function Th({children, className}: ThProps) {
    return <th className={th({className})}>{ children }</th>
}

const td = tv({
    base: 'flex items-center gap-2 h-10 text-slate-100 text-sm font-normal',
});

type TdProps = VariantProps<typeof td> & {
    children: React.ReactNode
    className?: string
};

function Td({children, className}: TdProps) {
    return <td className={td({className})}>{ children }</td>
}

export default function Home() {
    const [exams, setExams] = useState<ListProps>();

    function getDate(created_at: string) {
        let month = Number(new Date(created_at).getMonth() + 1);
        const year = new Date(created_at).getFullYear();
        return `${month < 10 ? `0${month}` : month}/${year}`;
    }   

    async function init() {
        const data = await getDocs(collection(db, "exams"));
        const list = data.docs.map((doc) => {
            return {
                id: doc.id,
                patient: doc.data().patient,
                service: doc.data().service,
                price: doc.data().price,
                doctor: doc.data().doctor,
                status: doc.data().status,
                created_at: doc.data().created_at.toDate()
            }
        }) as ListProps;

        setExams(list);
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <div className="container m-auto grid grid-cols-12 gap-4 pt-10">
            <div className="col-span-8 bg-zinc-900 rounded-lg py-4 px-4">
                <h1 className="text-base font-normal uppercase text-slate-100 mb-2">
                    Atendimentos
                </h1>
                <table className="w-full">
                    <thead className="border-b border-slate-100">
                        <tr className="grid grid-cols-12 px-2">
                            <Th className="col-span-4">Nome</Th>
                            <Th className="col-span-3">Serviço</Th>
                            <Th className="col-span-2">Valor</Th>
                            <Th className="col-span-1">Data</Th>
                            <Th className="col-span-2 justify-end">Status</Th>
                        </tr>
                    </thead>
                    <tbody>
                            {exams && exams.map(doc => {
                                return (
                                    <tr className="grid grid-cols-12 px-2 border-b last:border-b-0 border-slate-100/50 hover:cursor-pointer hover:bg-zinc-500/50" key={doc.patient}>
                                        <Td className="col-span-4">{doc.patient}</Td>
                                        <Td className="col-span-3">{doc.service}</Td>
                                        <Td className="col-span-2">R${doc.price}</Td>
                                        <Td className="col-span-1">{getDate(doc.created_at)}</Td>
                                        {doc.status 
                                            ? <Td className="col-span-2 justify-end"><span className="py-1 px-2 rounded-lg text-lime-300 bg-lime-400/30">Pago</span></Td> 
                                            : <Td className="col-span-2 justify-end"><span className="py-1 px-2 rounded-lg text-orange-300 bg-orange-400/30">Pendente</span></Td>
                                        }
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>
            </div>

            <div className="col-span-4 bg-zinc-900 rounded-lg py-4 px-4">
                <h1 className="text-base font-normal uppercase text-slate-100 mb-2">
                    Ações
                </h1>    
            </div>
        </div>
    )
}