const { response } = require('express');
const Job = require('../models/Job');

const getJobs = async (req, res = response) => {
    try {
        // Filtra los trabajos por el usuario autenticado
        const jobs = await Job.find({ user: req.uid }).populate('user', 'name');

        res.json({
            ok: true,
            jobs
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
};

const crearJob = async (req, res = response) => {
    const job = new Job(req.body);
    try {
        job.user = req.uid;
        const jobGuardado = await job.save();
        res.json({
            ok: true,
            job: jobGuardado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
};

const actualizarJob = async (req, res = response) => {
    const jobId = req.params.id;
    const uid = req.uid;

    try {
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                ok: false,
                msg: 'Trabajo no encontrado por ID'
            });
        }

        if (job.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este trabajo'
            });
        }

        const nuevoJob = {
            ...req.body,
            user: uid
        };

        const jobActualizado = await Job.findByIdAndUpdate(jobId, nuevoJob, { new: true });

        res.json({
            ok: true,
            job: jobActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        });
    }
};

const eliminarJob = async (req, res = response) => {
    const jobId = req.params.id;
    const uid = req.uid;

    try {
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                ok: false,
                msg: 'Trabajo no encontrado por ID'
            });
        }

        if (job.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este trabajo'
            });
        }

        await Job.findByIdAndDelete(jobId);
        res.json({
            ok: true,
            msg: 'Trabajo eliminado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        });
    }
};

module.exports = {
    getJobs,
    crearJob,
    actualizarJob,
    eliminarJob
};
