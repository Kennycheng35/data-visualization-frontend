import React from 'react';
import {Component} from 'react';
import {Bubble} from 'react-chartjs-2';
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
              labelString: 'Annual Income'
            }
        }],
        xAxes: [{
            ticks: {
                beginAtZero: true
            },
            scaleLabel: {
              display: true,
              labelString: 'Monthly Debt'
            }
        }]
    }
}

export default class BubbleComp extends Component{

    constructor(props) {
		super(props);
		this.state = {
            datasets: [
              {
                label: 'Rent',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(255,0,0,0.4)',
                borderColor: 'rgba(255,0,0,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(255,0,0,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(255,0,0,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: []
              },
              {
                label: 'Home Mortgage',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(0,255,0,0.4)',
                borderColor: 'rgba(0,255,0,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(0,255,0,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(0,255,0,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: []
              },
              {
                label: 'Own Home',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(0,0,255,0.4)',
                borderColor: 'rgba(0,0,255,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(0,0,255,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(0,0,255,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: []
              },
            ],
            offset:5000
		}
    }
    
    async submit(dataWindow) {
      const query = ({"query":`{\n  allCustomersList${dataWindow} {\n    annualIncome\n monthlyDebt \n creditScore \n homeOwnership \n }\n}\n`,"variables":null});
      const results = await axios.post('http://localhost:3000/graphql/graphql',query);
      const resFormat = results.data.data.allCustomersList.map(el=>{
        return {
          "x":el.monthlyDebt,
          "y":el.annualIncome,
          "r":2,
          "homeOwnership":el.homeOwnership
        }
      })
      const rent = resFormat.filter(el=>el.homeOwnership === 'Rent');
      const homeMortgage = resFormat.filter(el=>el.homeOwnership === 'Home Mortgage');
      const ownHome = resFormat.filter(el=>el.homeOwnership === 'Own Home');

      let x = this.state.datasets.slice(); 
      x[0].data = rent;
      x[1].data = homeMortgage;
      x[2].data = ownHome;
      this.setState({datasets:x});
      console.log(this.state.datasets[0].data);
      // console.log(resFormat);
      this.setState({offset:this.state.offset+5000});
    }

    componentDidMount(){
      console.log('submitted');
      this.submit('(first:5000)');
    }

    render() {
        return (
        <div>
            <h2>Annual Income vs. Monthly Debt Split by Housing Type</h2>
            <Bubble data={this.state} options={options}/>
            <button onClick={()=>this.submit(`(offset:${this.state.offset}, first:5000)`)}>reroll</button>
        </div>
        );
    }

};