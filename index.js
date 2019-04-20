const Discord = require('discord.js')
const client = new Discord.Client()
const prefix = "tc/";
const fs = require("fs")

let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

client.on('ready', () => {
    client.user.setActivity(`tc/help | est sur ${client.guilds.size} serveurs | Bêta v1.3`, {type:"WATCHING"})
    console.log("bot co")
})

client.login (config.token)

/*Réponse du bot*/
client.on('message', message =>{
    if(message.content === "Ça va ?"){
        message.channel.sendMessage('**Oui et toi :thinking: ?**');
        console.log('oki!');
    }
});

/*Réponse du bot n°2*/
client.on('message', message =>{
    if(message.content === "Moi ça va super merci et toi ?"){
        message.channel.sendMessage('**Ça va ultra bien merci :ok_hand: !**');
        console.log('oki!');
    }
});

/*Réponse du bot n°3*/
client.on('message', message =>{
    if(message.content === "tc/help"){
       console.log('oki!');
        let help_embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle("Voici la page d'aide :")
        .addField("♨ Commande(s) de Modération :", "tc/warns [mention-member] [raison], tc/seewarns [mention-member], tc/clearwarns [mention-member], tc/clear [nombre de message], tc/mute [mention-member], tc/unmute [mention-member], tc/kick [mention-member]")
        .addField(":rocket: Commande(s) d'Administration :", "tc/ban [mention-member]")
        .addField(":pushpin: Commande(s) Fun :", "_Bientôt disponible..._")
        .addField(":newspaper: Commande(s) d'info :", "_Bientôt disponible..._")
        .setFooter("© 2019 TeamCookies | Tous droits réservés | Créateur: Gamelog 🍪#2019 et Gatsu#7200 | </> [𝐗𝐁] F𝐮𝐬𝐢ø𝐧_ </>#9370 nous a fait confiance.")

        message.channel.send(help_embed)
    }
});

/*Système de Warn entier*/
client.on('message', message =>  {
    if(message.content.startsWith(prefix + "warns")) {
        const warn = JSON.parse(fs.readFileSync("./warn.json", "utf8"));
        if(!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send("_:x: Tu n'a pas la permission :x:_")
        var mentions = message.mentions.users.first();
        if(!mentions) return message.channel.send("_:x: Je ne trouve pas ce membre :x:_")
        if (mentions) {
            var mention2 = mentions;
        } else {
            var mention2 = message.author;
        }
        var raison10 = message.content.substr(32)
        if(warn[mention2.id]){
            warn[mention2.id] = {"warn" : warn[mention2.id].warn + `:warning: **Warn par ${message.author.tag}, le warn \`${args[0]}\`.`}
            fs.writeFile("./warn.json", JSON.stringify(warn), (err) =>
            {if (err) console.error(err);});
        }else{
            warn[mention2.id] = {"warn" : `:warning: **Warn par ${message.author.tag}, le warn \`${raison10}\`.`}
            fs.writeFile("./warn.json", JSON.stringify(warn), (err) =>
{if (err) console.error(err);});
        }
        message.channel.send(`${mention2.tag} a bien été avertie :white_check_mark:.`)
    }

    if(message.content.startsWith(prefix + "seewarns")){
        const warn = JSON.parse(fs.readFileSync("./warn.json", "utf8"));
        let nombre = 0
        for(var i in warn){
            nombre = nombre + 1
            }
        var mentions = message.mentions.users.first();
        if(!mentions) return message.channel.send("_:x: Je ne trouve pas ce membre :x:_")
        if (mentions) {
            var mention2 = mentions;
        } else {
            var mention2 = message.author;
        }
        if(warn[mention2.id]){
            message.channel.send(`Voici les warnings de ${mention2.tag} :\n${warn[mention2.id].warn}\nIl a \`${nombre}\` warns.**`)
        }else{
            message.channel.send(`**Il n'a aucun warn !**`)
        }
    }

    if(message.content.startsWith(prefix + "clearwarns")){
        const warn = JSON.parse(fs.readFileSync("./warn.json", "utf8"));
        if(!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send("_:x: Tu n'a pas la permission :x:_")
        var mentions = message.mentions.users.first();
        if(!mentions) return message.channel.send("_:x: Je ne trouve pas ce membre :x:_")
        if (mentions) {
            var mention2 = mentions;
        } else {
            var mention2 = message.author;
        }
        if(warn[mention2.id]){
            delete warn[mention2.id]
            fs.writeFile("./warn.json", JSON.stringify(warn), (err) =>
            {if (err) console.error(err);});
            message.channel.send(`J'ai supprimé les warns de ${mention2.tag}.`)
        }else{
            message.channel.send(`${mention2.tag} n'a aucun warn, donc je ne peux pas supprimer ces warns.`)
        
        }
        }
})

/*A rejoint*/
client.on('guildMemberAdd', member =>{
    let embed = new Discord.RichEmbed()
    .setDescription(':tada: '  + member.user.username + ' vient de rejoindre le serveur  ' +  member.guild.name)
    .setFooter('Nous sommes désormais ' + member.guild.memberCount + ' grasse à toi ')
    member.guild.channels.get('565824686274117642').send(embed)
});

/*A quitter*/
client.on('guildMemberRemove', member =>{
    let embed = new Discord.RichEmbed()
    .setDescription( ':cry:' + member.user.username + ' vient de quitter le serveur ' +  member.guild.name + ' dommage ')
    .setFooter('Nous sommes désormais ' + member.guild.memberCount)
    member.guild.channels.get('565824686274117642').send(embed)

});

/*Kick*/
client.on('message',message =>{
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

    if (args[0].toLowerCase() === prefix + 'kick'){
        if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send(":x: _Vous ne pouvez pas utiliser cette commande_ :x: " );
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("_:x: Veuillez mentionner un utilisateur :x:_ ") 
        if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id) return message.channel.send("_:x: Vous ne pouvez pas kick cet utilisateur :x:_")
        if (!member.kickable) return message.channel.send("**_ :x: Je ne peux pas exclure cet utilisateur :x:_**")
        member.kick()
        message.channel.send(member.user.username + ' **vient de ce faire exclure du serveur :white_check_mark:**')
    }
});

/*Ban*/
client.on('message',message =>{
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

    if (args[0].toLowerCase() === prefix + 'ban'){
        if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send(":x: _Vous ne pouvez pas utiliser cette commande_ :x: ");
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("_:x: Veuillez mentionner un utilisateur :x:_ ") 
        if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id) return message.channel.send("_:x: Vous ne pouvez pas ban cet utilisateur :x:_")
        if (!member.bannable) return message.channel.send("_ :x: Je ne peux pas bannir cet utilisateur :x:_")
        member.guild.ban(member, {days: 7})
        message.channel.send(member.user.username + ' **vient de ce faire bannir du serveur :white_check_mark:')
    }
});

/*Clear et Mute*/
client.on("message", message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
 
    if (args[0].toLowerCase() === prefix + "clear") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("❌ _Vous n'avez pas la permission d'utiliser cette commande_ ❌")
        let count = args[1]
        if (!count) return message.channel.send("❌ _Veuillez indiquer un nombre de messages à supprimer_ ❌")
        if (isNaN(count)) return message.channel.send("❌ _Veuillez indiquer un nombre valide_ ❌")
        if (count < 1 || count > 100) return message.channel.send("❌ _Veuillez indiquer un nombre entre 1 et 100_ ❌")
        message.channel.bulkDelete(parseInt(count) + 1)
    }
  if (args[0].toLowerCase() === prefix + "mute") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("❌ _Vous n'avez pas la permission d'utiliser cette commande_ ❌")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("❌ _Membre introuvable_ ❌")
        if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("❌ _Vous ne pouvez pas mute ce membre_ ❌")
        if (member.highestRole.calculatedPosition >= message.guild.me.highestRole.calculatedPosition || member.id === message.guild.ownerID) return message.channel.send("❌ _Je ne peux pas mute ce membre_ ❌")
        let muterole = message.guild.roles.find(role => role.name === 'Muted')
        if (muterole) {
            member.addRole(muterole)
            message.channel.send(member + ' a été mute ✅')
        }
        else {
            message.guild.createRole({name: 'Muted', permissions: 0}).then((role) => {
                message.guild.channels.filter(channel => channel.type === 'text').forEach(channel => {
                    channel.overwritePermissions(role, {
                        SEND_MESSAGES: false
                    })
                })
                member.addRole(role)
                message.channel.send(member + " **vient de ce faire mute :Pixel_Yes:**")
            })
        }
    }
  if (args[0].toLowerCase() === prefix + "unmute") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("❌ _Vous n'avez pas la permission d'utiliser cette commande_ ❌")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("❌ _Membre introuvable_ ❌")
        if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("❌ _Vous ne pouvez pas unmute ce membre_ ❌")
        if (member.highestRole.calculatedPosition >= message.guild.me.highestRole.calculatedPosition || member.id === message.guild.ownerID) return message.channel.send("❌ _Je ne peux pas unmute ce membre_ ❌")
        let muterole = message.guild.roles.find(role => role.name === 'Muted')
        if (muterole) {
            member.removeRole(muterole)
            message.channel.send(member + ' a été unmute ✅')
        }
        else {
            message.channel.send("_❌ Je ne peux pas unmute cet utilisateur ! :x:_")
}
                
 
            
        }
    
})