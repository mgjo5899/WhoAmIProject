import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import TextFieldGroup from '../../../../common/TextFieldGroup'

import axios from 'axios'
class Instagram extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
            pics: [],
            texts: []
		};

		this.getMostLiked = this.getMostLiked.bind(this);
		this.getMostRecent = this.getMostRecent.bind(this);
    }
    
    componentWillMount() {
        axios.get(`https://api.instagram.com/v1/users/self/media/recent/?access_token=`)
        .then(res => {

            console.log(res.data.data)

        var picsArr = []

        for(var i = 0; i < res.data.data.length; i++) {

            picsArr.push(res.data.data[i].images.standard_resolution.url)
        }

        this.setState({
            pics: picsArr
        });


        
        })
    }

    getMostLiked() {
        axios.get(`https://api.instagram.com/v1/users/self/media/recent/?access_token=`)
        .then(res => {

            this.setState({
                pics: res.data.data
            });

            this.state.pics.sort(function(a, b){

                if(a.likes.count < b.likes.count) return 1;
                if(a.likes.count > b.likes.count) return -1;

                return 0;
            });

            var picsArr = []

            for(var i = 0; i < 5; i++) {
    
                picsArr.push(this.state.pics[i].images.standard_resolution.url)
            }
    
            this.setState({
                pics: picsArr
            });
        })
    }

    getMostRecent() {
        axios.get(`https://api.instagram.com/v1/users/self/media/recent/?access_token=`)
        .then(res => {

            this.setState({
                pics: res.data.data
            });

            var picsArr = []

            for(var i = 0; i < 5; i++) {
    
                picsArr.push(this.state.pics[i].images.standard_resolution.url)
            }
    
            this.setState({
                pics: picsArr
            });
        })
    }

	render() {
        
		return (
			<div>
                <div>
                    <button onClick={this.getMostLiked}>5 Most Liked</button>
                    <button onClick={this.getMostRecent}>5 Most Recent</button>
                </div>

                {this.state.pics.map(field => <img src={field}/>)}
            </div>
	);
}
} 	

export default Instagram;