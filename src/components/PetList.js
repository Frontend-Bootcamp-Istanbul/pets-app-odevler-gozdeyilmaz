import React from 'react';
import {Pet} from "../components";
import {getPets} from "../constants";
import {stringContains} from "../helpers";


class PetList extends React.Component{
    breed;
    constructor(props){
        super(props);
        this.state = {
            _pets: [],
            pets: [],
            yukleniyor: true,
            loadCount: 4,
        }
    }
    petIdCallback = (id) => {
        this.props.petIdCallback(id)
    }

    componentDidMount() {
        getPets().then((data) => {
            this.setState({
                _pets: data,
                pets: data,
                yukleniyor: false
            })
        })
    }


    componentDidUpdate(prevProps) { //activefilter propu değişti bunu bu method ile yakalarım. 
        if(prevProps.activeFilter !== this.props.activeFilter){
            this.filterPets();
        }
        if(prevProps.searchValue !== this.props.searchValue){
            this.filterPets();
        }
    }

    filterPets = () => {
        if(!this.props.activeFilter){
            this.setState({
                pets: this.state._pets.filter((pet) => {
                    return stringContains(pet.name, this.props.searchValue)
                })
            })
        }else{
            this.setState({
                pets: this.state._pets.filter((pet) => {
                    return pet.breed === this.props.activeFilter;
                }).filter((filteredPet) => {
                    return stringContains(filteredPet.name, this.props.searchValue)
                })
            })
        }
    }

    onscrollHandler = () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            const loadCount = this.state.loadCount;
            const petsLength = this.state.pets.length;
            if (loadCount < petsLength) {
                this.setState({
                    loadCount: loadCount + ((petsLength - loadCount >= 4) ? 4 : (petsLength - loadCount))
                });
            }
        }
    }
    //sayfa aşağı indikçe çoğalır.


    render(){
        window.onscroll = this.onscrollHandler;
        const Yukleniyor = <div>Yukleniyor</div>;
        const EmptyPets = <div>Bulunamadı</div>;
        const slices = this.state.pets.slice(0, this.state.loadCount);
        const Pets = 
        <React.Fragment>
            <h3>Gösterilen Pet Sayısı: {slices.length} {/* toplamda kaç pet olduğu */}
            </h3>
            <div className="row">
            {
                slices.map((pet) => {
                    return <Pet petIdCallback={this.petIdCallback} key={pet.id} {...pet} />
                })
                
            }
            </div>
        </React.Fragment>
        
        if(this.state.yukleniyor){
            return Yukleniyor;
        }else if(this.state.pets.length === 0){
            return EmptyPets
        }else{
            return Pets;
        }
    }
}


export default PetList;
