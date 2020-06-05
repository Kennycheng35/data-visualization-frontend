import React from 'react';
import {Component} from 'react';
import {Polar} from 'react-chartjs-2';
import axios from 'axios';

export default class PolarChart extends Component{

    constructor(props) {
		super(props);
		this.state = {
            datasets: [{
              data: [      
              ],
              backgroundColor: [
              ],
              label: 'My dataset' // for legend
            }],
            labels: [
            ]
        };
    }
    
    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++){
            color += letters[Math.floor(Math.random()*16)];
        }
        return color;
    }

    async submit(dataWindow) {
      const query = ({"query":`{\n  allLoansList${dataWindow} {\n  purpose \n }\n}\n`,"variables":null});
      const results = await axios.post('http://localhost:3000/graphql/graphql',query);
      let purposeMap = {};
      results.data.data.allLoansList.forEach(res=>{
        //   console.log(res);
        if (!purposeMap[res.purpose])
            purposeMap[res.purpose] = 1;
        else 
            purposeMap[res.purpose] = purposeMap[res.purpose]+1;
      });
      let purposeArr = [];
      let numberArr = [];
      let colorArr = [];
      for (const [key, value] of Object.entries(purposeMap)){
          purposeArr.push(key);
          numberArr.push(value);
          colorArr.push(this.getRandomColor());
      };

      const polarState = {
          datasets: [{
              data: numberArr,
              backgroundColor: colorArr
          }],
          labels: purposeArr
      }
      this.setState(polarState);
      console.log(this.state);
    //   console.log(this.state.datasets[0].data);
    //   // console.log(resFormat);
    //   this.setState({offset:this.state.offset+5000});
    }

    componentDidMount(){
      console.log('submitted');
      this.submit('');
    }

    render() {
        return (
        <div>
            <h2>Amount of Loans By Type</h2>
            <Polar data={this.state} />
            {/* <button onClick={()=>this.submit(`(offset:${this.state.offset}, first:5000)`)}>reroll</button> */}
        </div>
        );
    }

};