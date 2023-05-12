import React, { Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// import style from './Home.module.scss';
import { connectMetamask } from '../../redux/actions/user';
import { get } from 'lodash';

// import * as Web3 from 'web3';
// import { OpenSeaPort, Network } from 'opensea-js';
import axios from 'axios';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['X-API-KEY'] = process.env.REACT_APP_OPENSEA_API_KEY;

class Home extends Component {
    state = {
        collectionSlug: 'azuki-god',
        startToken: 0,
        endToken: 0,
        startAmount: 0.04,
        userAddress: '0x720A4FaB08CB746fC90E88d1924a98104C0822Cf'
    }
    // const history = useHistory();
    // const { setConnectModalOpen } = useContext(AppContextType);
    // const accountAddress = useSelector(state => state.user.userAccount?.accounts[0] ?? '');
    // const featuresRef = useRef(null);

    componentDidMount() {
        const { connectMetamask } = this.props;

        connectMetamask().then(() => {
            const { connectWalletState } =  this.props;
            // const isConnect = get(connectWalletState, 'isConnect');
            // if (isConnect) {
            //     // this.setState({})
            //     // return history.push(path);
            // }

            const connectError = get(connectWalletState, 'error');

            if (connectError) {
                const errorCode = get(connectError, 'code', '');
                if (errorCode.toString() === '-32002') {
                return alert('Please login to Metamask');
                }
                // TODO Make popup ask user install extension
                if (errorCode.toString() === '-32000') {
                return true;
                }
                console.log('connectError: ', connectError);
                return alert('Please install Metamask extension!');
            }
        });

        // if (web3Provider != null) {
        //     console.log("web3Provider: ", web3Provider);
        // }
        
    }

    handleOnChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    }

    handleBidding = async () => {
        const { seaport, userAccountState } = this.props;
        const { collectionSlug, startToken, endToken, startAmount } = this.state;
        const accountAddress = userAccountState.accounts[0];
        console.log("accountAddress: ", accountAddress);
        let assets = [];
        console.log("hello collection");

        //get collection details
        const response = await axios({
            method: 'get',
            url: process.env.REACT_APP_OPENSEA_TESTNET_API_URL +'v1/collection/'+ collectionSlug,  // example:- azuki-god
            responseType: 'json'
        });

        if (response.data && response.data.collection) {
            const collection = response.data.collection;
            for (var i = parseInt(startToken); i <= parseInt(endToken); i++) {
                assets.push({tokenId: i, tokenAddress: collection.primary_asset_contracts[0].address});
            }

            console.log("assets: ", assets);

            return;

            //single token buy order
            // const offer1 = await seaport.createBuyOrder({
            //     asset: {
            //       tokenId: 175,
            //       tokenAddress: '0xb74bf94049d2c01f8805b8b15db0909168cabf46',
            //       //schemaName // WyvernSchemaName. If omitted, defaults to 'ERC721'. Other options include 'ERC20' and 'ERC1155'
            //     },
            //     accountAddress,
            //     // Value of the offer, in units of the payment token (or wrapped ETH if none is specified):
            //     startAmount,
            // });
            // console.log("offer1: ", offer1);

            //multiple tokens buy orders
            const offer = await seaport.createBundleBuyOrder({
                assets,
                accountAddress,
                startAmount,
                // Optional expiration time for the order, in Unix time (seconds):
                // expirationTime: Math.round(Date.now() / 1000 + 60 * 60 * 24) // One day from now
            });
            console.log("offer: ", offer);
        }

    };

    hanldeTrackAddress = async () => {
        console.log("Hello");
        const { userAddress } = this.state;

        // const Addr = '0x720A4FaB08CB746fC90E88d1924a98104C0822Cf';

        //get collection details
        const response = await axios({
            method: 'get',
            url: process.env.REACT_APP_OPENSEA_MAINNET_API_URL +'v1/events?only_opensea=true&account_address=' + userAddress +'&event_type=successful',  // get events from specific address
        });

        if (response.data && response.data.asset_events) {
            const asset_events = response.data.asset_events;
            console.log("asset_events: ", asset_events);
        }

    }

    render() {
        const { state } = this.state;
        return (
            <div>
                <div>
                    <h1>Opensea Bidding Bot</h1>
                    <input type="text" name="collectionSlug" value={this.state.collectionSlug} onChange={e => this.handleOnChange(e)} placeholder="Enter collection slug"></input><br/>
                    <label>Start Token</label>
                    <input type="number" name="startToken" value={this.state.startToken} onChange={e => this.handleOnChange(e)}></input><br/>
                    <label>End Token</label>
                    <input type="number" name="endToken" value={this.state.endToken} onChange={e => this.handleOnChange(e)}></input><br/>
                    <label>Price</label>
                    <input type="number" name="startAmount" value={this.state.startAmount} onChange={e => this.handleOnChange(e)}></input><br/>

                    <button onClick={() => this.handleBidding()}>Start</button>
                </div>

                <div>
                    <h1>Track Address</h1>
                    <input type="text" name="userAddress" value={this.state.userAddress} onChange={e => this.handleOnChange(e)} placeholder="Enter Address to track"></input><br/>
                
                    <button onClick={() => this.hanldeTrackAddress()}>Start</button>
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({
      userAccountState: state.user.userAccount,
      connectWalletState: state.user.connectWallet,
      seaport: state.user.seaport
    }),
    dispatch => bindActionCreators({
      connectMetamask
    }, dispatch),
)(Home);
  
