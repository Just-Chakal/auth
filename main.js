console.clear();
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
const mongoose = require('mongoose');

function log(str) {
    console.log(str)
};

mongoose.connect('VOTRE LIEN MONGO DB');
mongoose.connection.on('connected', () => {
    //log('Mongoose : Connected')
});
mongoose.connection.on('err', err => {
    //console.error(`Mongoose : Connection Failed \nError : ${err.stack}`)
});

const userschema = mongoose.model('users', {
    UUID: String,
    username: String,
    password: String,
    license: String,
    expire: String
});

function rdmstr(length) {
    var result = '';
    var characters = 'ABCDEabcde0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

function main() {
    console.clear()
    readline.question('[1] Login\n[2] Register\n\n[+] Choice : ', choice => {
        if (choice == '1') {
            console.clear()
            readline.question('[-] Username : ', async username => {
                const checkuser = await userschema.findOne({
                    username: username
                })
                if (!checkuser) {
                    console.clear()
                    log('No user with this username! Back to main menu in 3s..')
                    return setTimeout(() => {
                        main()
                    }, 3000);
                }
                readline.question('[-] Password : ', async password => {
                    const checkuserpass = await userschema.findOne({
                        username: username,
                        password: password
                    })
                    if (!checkuserpass) {
                        console.clear()
                        log('Wrong password! Back to main menu in 3s..')
                        return setTimeout(() => {
                            main()
                        }, 3000);
                    } else {
                        console.clear()
                        log('Connected')
                    }
                })
            })
        } else if (choice == '2') {
            console.clear()
            readline.question('[-] Username : ', async username => {
                const checkuser = await userschema.findOne({
                    username: username
                })
                if (checkuser) {
                    console.clear()
                    log('Username already taken! Back to main menu in 3s..')
                    return setTimeout(() => {
                        main()
                    }, 3000);
                }
                readline.question('[-] Password : ', async password => {
                    console.clear()
                    new userschema({
                        UUID: rdmstr(25),
                        username: username,
                        password: password,
                    }).save().then(
                        log('Account created! Back to main menu in 3s..'))
                    return setTimeout(() => {
                        main()
                    }, 3000);
                })
            })
        }
    })
}
main()