import React from 'react';
import {Component} from 'react';
import {Bar} from 'react-chartjs-2';
import axios from 'axios';

const options = {
    responsive: true,
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true, 
            
            },
            scaleLabel: {
              display: true,
              labelString: 'Customers'
            }
        }]
    }
}

export default class BarChart extends Component{

    constructor(props) {
		super(props);
		this.state = {
            labels: ['Rent', 'Home Mortgage', 'Own Home'],
            datasets: [
              {
                label: 'My First dataset',
                backgroundColor: ['rgba(255,0,0,0.4)','rgba(0,255,0,0.4)','rgba(0,0,255,0.4)'],
                borderColor: ['rgba(255,0,0,1)','rgba(0,255,0,1)','rgba(0,0,255,1)'],
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: []
              },
            ],
            offset:5000
        }
    }
    
    async submit(dataWindow) {
        const query = ({"query":`{\n  allCustomersList${dataWindow} {\n  homeOwnership \n }\n}\n`,"variables":null});
        const results = await axios.post('http://localhost:3000/graphql/graphql',query);
        console.log(results);
        const rent = results.data.data.allCustomersList.filter(el=>el.homeOwnership === 'Rent');
        const homeMortgage = results.data.data.allCustomersList.filter(el=>el.homeOwnership === 'Home Mortgage');
        const ownHome = results.data.data.allCustomersList.filter(el=>el.homeOwnership === 'Own Home');
        
        let x = this.state.datasets.slice(); 
        console.log(rent.length,homeMortgage.length,ownHome.length)
        console.log('x',x);
        x[0].data = [rent.length, homeMortgage.length, ownHome.length]
        this.setState({datasets:x});
        console.log('data', this.state.datasets[0].data);
        // console.log(results);
        this.setState({offset:this.state.offset+5000});
    }


    componentDidMount(){
        console.log('submitted');
        this.submit('(first:5000)');
    }

    render() {
        return (
        <div>
            <h2>Amount of Customers By Housing Type</h2>
            <Bar data={this.state} options={options}/>
            <button onClick={()=>this.submit(`(offset:${this.state.offset}, first:5000)`)}>reroll</button>
        </div>
        );
    }

};