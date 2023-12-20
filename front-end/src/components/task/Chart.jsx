import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useSelector } from 'react-redux';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Chart() {
    const tasks = useSelector(state=>state.tasks)
    if (tasks === null) return null;
    const todo = tasks?.filter(e=>e.status==="todo").length??0
    const processing = tasks?.filter(e=>e.status==="processing").length??0
    const done = tasks?.filter(e=>e.status==="done").length??0
    const data = {
        labels: ['Todo', 'Processing', 'Done'],
        datasets: [
            {
                label: 'Tasks',
                data: [todo, processing, done],
                backgroundColor: [
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };
    return todo+processing+done===0?null:<Pie data={data} />;
}
