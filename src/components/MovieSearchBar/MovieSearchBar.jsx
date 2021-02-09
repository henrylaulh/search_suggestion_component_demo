import React from 'react';
import axios from 'axios';

export default class MovieSearchBar extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            searchKeywords: "",
            movieList : [],
            tvList: [],

            timer: null,
        }
    }

    search(){
        const {searchKeywords} = this.state;
        const URL = "http://www.omdbapi.com";
        const API_KEY = "7468f8b0";
        const LIST_SIZE = 8;

        //API for fetching list of movies
        axios.get(URL, {
            params: {
                apiKey: API_KEY,
                s: searchKeywords,
                type: 'movie'
            }
        }).then((resp) => {
            if(resp.data.Response == "True" && resp.data.Search.length){
                this.setState({movieList: resp.data.Search.slice(0,LIST_SIZE)})
            }
            else{
                this.setState({movieList: []});
            }
        })

        // API for fetching list of TV series in case the API above does not return any TV series
        axios.get(URL, {
            params: {
                apiKey: API_KEY,
                s: searchKeywords,
                type: 'series'
            }
        }).then((resp) => {
            if(resp.data.Response == "True" && resp.data.Search.length){
                this.setState({tvList: resp.data.Search.slice(0,LIST_SIZE)})
            }
            else{
                this.setState({tvList: []})
            }
        })
    }

    searchBoxOnChange(val) {
        const {timer, searchKeywords} = this.state;

        this.setState({ searchKeywords: val.target.value }, () => {
            // If timer is not running
            if(!timer){
                var t = setTimeout(() => {
                    this.search();
                    this.setState({ timer: null });
                }, 500);
    
                this.setState({timer: t});
            }
        })

    }

    renderMovieList(){
        const {movieList, searchKeywords} = this.state;

        var render_arr = [];


        var searchKeyword_arr = searchKeywords.split(' ');

        movieList.forEach(item => {

            var re = new RegExp(searchKeywords, 'ig');
            var string = item.Title.replace(re, (str) => {
                return '<strong>' + str + '</strong>';
            });

            render_arr.push(<li dangerouslySetInnerHTML={{__html: `${string}`}}></li>);

        })

        return(
            <>  
                {render_arr}
            </>
        )
    }

    renderTVList(){
        const {tvList, searchKeywords} = this.state;
        var render_arr = [];

        var searchKeyword_arr = searchKeywords.split(' ');

        tvList.forEach(item => {

            var re = new RegExp(searchKeywords, 'ig');
            var string = item.Title.replace(re, (str) => {
                return '<strong>' + str + '</strong>';
            });


            render_arr.push(<li dangerouslySetInnerHTML={{__html: `${string}`}}></li>);


        })

        return(
            <>  
                {render_arr}
            </>
        )
    }


    render(){
        return (
            <div className="movie-search-bar-container">
                <div className="shadow-lg rounded-lg overflow-hidden bg-white">
                    <input id="searchbox" className="text-xl block w-full appearance-none bg-white placeholder-gray-400 px-4 py-3 rounded-lg outline-none" placeholder="Search for movie" onChange={(e) => this.searchBoxOnChange(e)} />

                    <div id="suggestions" className="px-2 py-2 border-t text-sm text-gray-800">
                        <div className="mb-3 ">
                            <h3 className="text-xs text-gray-600 pl-2 py-1">Movies</h3>
                            <ul>
                                {this.renderMovieList()}
                            </ul>
                        </div>

                        <div className="">
                            <h3 className="text-xs text-gray-600 pl-2 py-1">TV Shows</h3>
                            <ul>
                                {this.renderTVList()}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}