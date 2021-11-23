const { Router } = require('express');
const router = Router();
const tickets = require('../models/tickets');
const moment = require('moment');
const cron = require('node-cron');
const nodemailer = require('nodemailer');

router.get('/create',async (req, res) => {
    console.log("create");

for(let i = 1; i <= 2000; i++){

    await tickets.create({
        id: i,
        reserved: false,
        datereserved: null,
        confirmed: false
    });

}
res.send('Tickets created');
});

router.get('/found/:id', async (req, res) => {
    let t = {}
    try {
    if(req.params.id != "0"){
        if(typeof parseInt(req.params.id) === "number" && !isNaN(parseInt(req.params.id))){
            t = await tickets.find({
                id: parseInt(req.params.id)
            });
            console.log(t);
        }else{
            t = await tickets.find({});
        }
    }else{
        t = await tickets.find({});
    }
    res.status(200).json({ "success": true, "message": "data enviada correctamente", "data": t });
    }catch(e){
    res.status(500).json({ "success": true, "message": "data no enviada correctamente", "data": t });
    }
});
router.get('/updatezeros',async (req, res) => {
    console.log("updatezeros");
    let x = 0;

for(let i = 1; i <= 2000; i++){
    x = (i < 10) ? "000" + i : ((i < 100) ? "00" + i : ((i < 1000) ? "0" + i : i));
    console.log(x);
    await tickets.updateOne(
        { id: i },
        { $set: { id: x } },function(err, res) {
            if (err) console.log(err);
            console.log(res.result.nModified + " document(s) updated");
        }
    );

}
res.send('Tickets updated');   
});
router.put('/reservar/:id/:emai/:name/:lastname/:phone/:state/:city', async (req, res) => {
    let ts = req.params.id;
    let n = ts.includes("000");
    let d = ts.includes("00",1||0);
    let c = ts.startsWith("0");

ts = (n)? parseInt(ts.replace("000","")) : (d)? parseInt(ts.replace("00","")) : (c)? parseInt(ts.replace("0","")) : parseInt(ts);
    const my = `
    <Form method="put" action = "https://rifaschihuahualm.eu-4.evennode.com/confirmar/${ts}" style="margin="auto";background-color: #fff; justify-content: center; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px #000; margin: auto; width: 50%; }">
    <h1 style="color: #315DCC; font-size: 30px;">Ticket</h1>
    <p style="color: #000; font-size: 20px;">${req.params.name} ${req.params.lastname}</p>
    <p style="color: #000; font-size: 20px;">ha reservado un ticket</p>
    <p style="color: #000; font-size: 20px;">Su numero de ticket es: ${ts}</p>
    <p style="color: #000; font-size: 20px;">Fecha de reserva: ${moment().format('LLLL')}</p>
    <p style="color: #000; font-size: 20px;">Estado: ${req.params.state}</p>
    <p style="color: #000; font-size: 20px;">Ciudad: ${req.params.city}</p>
    <input type="submit" value="Confirmar Pago" style="border="none"; border-radius="100px"; margin-top: 20px; width: 120px; height: 90px; background-color: #315DCC; color: #fff;">
    <p style="color: #000; font-size: 20px;">Fecha de vencimiento de la reservacion: ${moment().add(15, 'days').format('LLLL')}</p>
    </form>
    `;
    const client = `
    <h1>Ticket</h1>
    <p>Hola ${req.params.name} ${req.params.lastname}</p>
    <p>Su ticket ha sido reservado con exito</p>
    <p>Su numero de ticket es: ${ts}</p>
    <p>Fecha de reserva: ${moment().format('LLLL')}</p>
    <p>Estado: ${req.params.state}</p>
    <p>Ciudad: ${req.params.city}</p>
    <h1>Favor de depositar en esta tarjeta</h1>
    <p>Numero de tarjeta: 5204 1654 4685 2190</p>
    <p>Fecha de vencimiento de la reservacion: ${moment().add(15, 'days').format('LLLL')}</p>
    `;
   let  transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'rifaschihuahualm@gmail.com',
            pass: 'V4mbQHKWPVvPX5bAO!zp'
        }
    });
    // client
     transporter.sendMail({
        from: 'rifaschihuahualm.com',
        to: req.params.emai,
        subject: 'Ticket #' + ts,
        html: client
    }, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log(info);
        }
    });
    // my
    transporter.sendMail({
        from: 'rifaschihuahualm.com',
        to: 'enrique.miranda78@hotmail.com',
        subject: 'Ticket #' + ts,
        html: my
    }, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log(info);
        }
    });
    // rifaschihuahualm
    transporter.sendMail({
        from: 'rifaschihuahualm.com',
        to: 'rifaschihuahualm@gmail.com',
        subject: 'Ticket',
        html: my
    }, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log(info);
        }
    });

    if(typeof ts === "number" && !isNaN(ts)){
        let t = await tickets.findOneAndUpdate({
            id: ts
        }, {
            reserved: true
        });
    }
    res.status(200).json({ "success": true, "message": "data actualizada correctamente"});
});
router.get('/confirmar/:id', async (req, res) => {
    await tickets.findOneAndUpdate({
        id: parseInt(req.params.id)
    }, {
        confirmed: true
    });
    res.status(200).json({ "success": true, "message": "data actualizada correctamente"});
});

router.get('/cancelar/:id', async (req, res) => {
    await tickets.findOneAndUpdate({
        id: parseInt(req.params.id)
    }, {
        reserved: false,
        confirmed: false
    });
    res.status(200).json({ "success": true, "message": "data actualizada correctamente"});
});

cron.schedule('* * * * *', () => {
    tickets.find({
        reserved: true,
        confirmed: false
    }).then(t => {
        if(t.length > 0){
            t.forEach(async (item) => {
                let d = moment(item.datereserved).add(15, 'days');
                if(moment().isAfter(d) || moment().isSame(d)){
                    await tickets.findOneAndUpdate({
                        id: item.id
                    }, {
                        reserved: false,
                        confirmed: false
                    });
                }
            });
        }
    });
});
router.get('/found/confirmed/:id', async (req, res) => {
    let t = {}
    try {
        t = await tickets.find({id : parseInt(req.params.id)});
    res.status(200).json({ "success": true, "message": "data enviada correctamente", "data": t });
    }catch(e){
    res.status(500).json({ "success": true, "message": "data no enviada correctamente", "data": t });
    }
});
module.exports = router;