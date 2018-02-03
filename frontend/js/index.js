let eth;
let token;

function showNotification(head, body) {
    $('#errorModal').modal('open');

    $('#errorHead').html(head);
    $('#errorBody').html(body);
}

function showLoading(message) {
    $('#loadingStatus').show();
    $("#loadingMessage").html(message);
}

function loadContract() {
    token.getStatus().then(status => {
        $('#loadingStatus').hide();

        status = status[0];

        if ( status == 0 ) { // Unfilled,
            $('#contractUnfilled').show();

            $('#makePosition').click(() => {
                const _position = $('#position').val();
                const value = $('#positionAmount').val();

                if ( _position == '' || value == 0 ) {
                    Materialize.toast("Please select a position", 4000);
                    return;
                }

                const position = +_position;

                $('#contractUnfilled').hide();
                showLoading("Making position...");

                eth.accounts().then(accounts => {
                    if ( accounts.length == 0 ) {
                        showNotification("No Accounts Loaded", "Please make sure you are logged in via metamask in order to fill this position.");
                        return;
                    }

                    token.fillPosition(position, {
                        from: accounts[0],
                        value:  Eth.toWei(value, 'ether'),
                    }).then(() => {
                        showNotification("Successfully Filled Position", "We've successfully filled the position. Reload the page and check the new status of the smart contract.");
                    }).catch(err => {
                        console.error("fillPosition error:", err);
                        showNotification("Failed to fill position", "Please check the logs and see what error was thrown.");
                    });
                });
            });
        }
        else if ( status == 1 ) { // ReadyStart
            $('#contractReadyStart').show();

            $('#startContract').click(() => {
                $('#contractReadyStart').hide();
                showLoading('Starting Contract...');

                eth.accounts().then(accounts => {
                    if ( accounts.length == 0 ) {
                        showNotification("No Accounts Loaded", "Please make sure you are logged in via metamask in order to start this contract.");
                        return;
                    }

                    token.startContract({
                        from: accounts[0]
                    }).then(() => {
                        showNotification("Successfully Started Contract", "We've successfully started the contract. Reload the page and check the new status of the smart contract.");
                    }).catch(err => {
                        console.error("startContract error:", err);
                        showNotification("Failed to start contract", "Please check the logs and see what error was thrown.");
                    });
                });
            });
        }
        else if ( status == 2 ) { // ContractLive
            showLoading('Loading Participant Information...');

            token.getBuyIn().then(amount => {
                console.log(amount);
                $("#contractValue").html(Eth.fromWei(amount[0].mul(Eth.toBN(2)), 'ether').toString());
                return token.getLong();
            }).then(long => {
                console.log('long address');
                $("#longAddress").html(long[0]);
                return token.getShort();
            }).then(short => {
                $("#shortAddress").html(short[0]);
            }).finally(() => {
                $('#loadingStatus').hide();
                $('#contractLive').show();
            }).catch(err => {
                console.log("Error getting information", err);
                showNotification("Failed To Load Information", "Failed to load contract information. Check logs and try again.");
            });
        }
        else if ( status == 3 ) { // ReadyEnd
            $('#contractReadyEnd').show();

            $('endContract').click(() => {
                $('#contractReadyEnd').hide();
                showLoading('Ending Contract...');

                eth.accounts().then(accounts => {
                    if ( accounts.length == 0 ) {
                        showNotification("No Accounts Loaded", "Please make sure you are logged in via metamask in order to end this contract.");
                        return;
                    }

                    token.endContract({
                        from: accounts[0]
                    }).then(() => {
                        showNotification("Successfully Ended Contract", "We've successfully ended the contract. Reload the page and check the new status of the smart contract.");
                    }).catch(err => {
                        console.error("startContract error:", err);
                        showNotification("Failed to end contract", "Please check the logs and see what error was thrown.");
                    });
                });
            });
        }
        else if ( status == 4 ) { // ReadySettled
            $('#contractReadySettle').show();

            $('settleContract').click(() => {
                $('#contractReadySettle').hide();
                showLoading('Settling Contract...');

                eth.accounts().then(accounts => {
                    if ( accounts.length == 0 ) {
                        showNotification("No Accounts Loaded", "Please make sure you are logged in via metamask in order to settle this contract.");
                        return;
                    }

                    token.settleContract({
                        from: accounts[0]
                    }).then(() => {
                        showNotification("Successfully Settled Contract", "We've successfully settled the contract. Check your ethereum address to see if you won!.");
                    }).catch(err => {
                        console.error("settleContract error:", err);
                        showNotification("Failed to settle contract", "Please check the logs and see what error was thrown.");
                    });
                });
            });
        }
    }).catch(err => {
        console.error(err);
        showNotification("Failed to get status", "Check console for the error message, however we were unable to contact the smart contract");
    });
}

$(() => {
    $('.modal').modal();
    $('select').material_select();

    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year,
        today: 'Today',
        clear: 'Clear',
        close: 'Ok',
        closeOnSelect: true,
        format: 'mm-dd-yyyy'
    });

    $('.timepicker').pickatime({
        default: 'now', // Set default time: 'now', '1:30AM', '16:30'
        fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
        twelvehour: false, // Use AM/PM or 24-hour format
        donetext: 'OK', // text for done-button
        cleartext: 'Clear', // text for clear-button
        canceltext: 'Cancel', // Text for cancel-button
        autoclose: false, // automatic close timepicker
        ampmclickable: true, // make AM PM clickable
        format: 'h:i A'
    });

    $('#getStarted').click(() => {
        if ( !window.web3 ) {
            showNotification("MetaMask not found!", "Please validate that you are accessing this page with metamask or another web browser that provides us with a web3 instance!");
            return;
        }

        eth = new Eth(web3.currentProvider);

        $('#welcomeStage').hide();
        $('#contractSelection').show();
    });

    $('#newContract').click(() => {
        $('#contractSelection').hide();
        $('#contractDeploy').show();
    });

    $("#existingContract").click(() => {
        $('#contractSelection').hide();
        $('#contractInput').show();
    });

    $('#deployContract').click(() => {
        const expiresDate = $('#expiresDate').val();
        const expiresTime = $('#expiresTime').val();
        let buyIn = $('#buyIn').val();
        const queryStr = $('#queryStr').val();
        const oracleAddr = $('#oracleAddr').val();

        if ( expiresDate.length == 0 || expiresTime.length == 0 || buyIn == 0 || queryStr.length == 0 || oracleAddr.length == 0 ) {
            Materialize.toast("Please fill out the form completely", 4000);
            return;
        }

        const time = new Date(expiresDate + ' ' + expiresTime).getTime() / 1000;
        const expires = Eth.toBN(time);

        buyIn = Eth.toWei(buyIn, 'ether');

        $('#contractDeploy').hide();
        showLoading('Deploying Contract...');

        eth.accounts().then(accounts => {
            if ( accounts.length == 0 ) {
                showNotification("No Accounts Loaded", "Please make sure you are logged in via metamask in order to deploy this contract.");
                return;
            }

            const FutureContract = eth.contract(window.abi, window.bytecode, {
                from: accounts[0],
                gas: 5000000
            });

            FutureContract.new(expires, buyIn, queryStr, oracleAddr).then(hash => {
                showLoading('Waiting For Deployment...');

                let checkTransaction = setInterval(() => {
                    eth.getTransactionReceipt(hash).then(receipt => {
                        if ( !receipt ) {
                            return;
                        }

                        clearInterval(checkTransaction);

                        showNotification("Successfully Deployed", "We've successfully deployed this contract to " + receipt.contractAddress + ". Please reload this page and use it via the existing contract selection.");
                    });
                }, 1000);
            }).catch(err => {
                console.error("Failed to deploy", err);
                showNotification("Failed to Deploy", "Failed to deploy the smart contract. Check console for the error message.");
            });
        });
    });

    $("#inputContractBtn").click(() => {
        const val = $('#inputContractAddress').val();

        if ( !val.startsWith('0x') && val.length != 42 ) {
            Materialize.toast("Please input a valid contract address", 4000);
            return;
        }

        token = eth.contract(window.abi).at(val);

        $('#contractInput').hide();
        showLoading('Loading Contract Status');

        loadContract();
    });
});
