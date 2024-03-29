const mongoose = require('mongoose');

const RI_Record_Schema = mongoose.Schema(
    {
        _id: { type: 'Number' },
        NO_SEQ_COLL: { type: 'String' },
        JR_SEMN_ACCDN: { type: 'String' },
        DT_ACCDN: { type: 'Date' },
        CD_MUNCP: { type: 'Number' },
        NO_CIVIQ_ACCDN: { type: 'Number' },
        SFX_NO_CIVIQ_ACCDN: { type: 'String' },
        BORNE_KM_ACCDN: { type: 'String' },
        RUE_ACCDN: { type: 'String' },
        TP_REPRR_ACCDN: { type: 'Number' },
        ACCDN_PRES_DE: { type: 'String' },
        NB_METRE_DIST_ACCD: { type: 'Mixed' },
        CD_GENRE_ACCDN: { type: 'Number' },
        CD_SIT_PRTCE_ACCDN: { type: 'Mixed' },
        CD_ETAT_SURFC: { type: 'Number' },
        CD_ECLRM: { type: 'Number' },
        CD_ENVRN_ACCDN: { type: 'Number' },
        NO_ROUTE: { type: 'Mixed' },
        CD_CATEG_ROUTE: { type: 'Number' },
        CD_ETAT_CHASS: { type: 'Mixed' },
        CD_ASPCT_ROUTE: { type: 'Number' },
        CD_LOCLN_ACCDN: { type: 'Number' },
        CD_POSI_ACCDN: { type: 'Mixed' },
        CD_CONFG_ROUTE: { type: 'Number' },
        CD_ZON_TRAVX_ROUTR: { type: 'Mixed' },
        CD_PNT_CDRNL_ROUTE: { type: 'String' },
        CD_PNT_CDRNL_REPRR: { type: 'String' },
        CD_COND_METEO: { type: 'Number' },
        NB_VEH_IMPLIQUES_ACCDN: { type: 'Number' },
        NB_MORTS: { type: 'Number' },
        NB_BLESSES_GRAVES: { type: 'Number' },
        NB_BLESSES_LEGERS: { type: 'Number' },
        HEURE_ACCDN: { type: 'String' },
        AN: { type: 'Number' },
        NB_VICTIMES_TOTAL: { type: 'Number' },
        GRAVITE: { type: 'String' },
        REG_ADM: { type: 'String' },
        MRC: { type: 'String' },
        nb_automobile_camion_leger: { type: 'Number' },
        nb_camionLourd_tractRoutier: { type: 'Number' },
        nb_outil_equipement: { type: 'Number' },
        nb_tous_autobus_minibus: { type: 'Number' },
        nb_bicyclette: { type: 'Number' },
        nb_cyclomoteur: { type: 'Number' },
        nb_motocyclette: { type: 'Number' },
        nb_taxi: { type: 'Number' },
        nb_urgence: { type: 'Number' },
        nb_motoneige: { type: 'Number' },
        nb_VHR: { type: 'Number' },
        nb_autres_types: { type: 'Number' },
        nb_veh_non_precise: { type: 'Number' },
        NB_DECES_PIETON: { type: 'Number' },
        NB_BLESSES_PIETON: { type: 'Number' },
        NB_VICTIMES_PIETON: { type: 'Number' },
        NB_DECES_MOTO: { type: 'Number' },
        NB_BLESSES_MOTO: { type: 'Number' },
        NB_VICTIMES_MOTO: { type: 'Number' },
        NB_DECES_VELO: { type: 'Number' },
        NB_BLESSES_VELO: { type: 'Number' },
        NB_VICTIMES_VELO: { type: 'Number' },
        VITESSE_AUTOR: { type: 'Mixed' },
        LOC_X: { type: 'Number' },
        LOC_Y: { type: 'Number' },
        LOC_COTE_QD: { type: 'String' },
        LOC_COTE_PD: { type: 'Number' },
        LOC_DETACHEE: { type: 'String' },
        LOC_IMPRECISION: { type: 'String' },
        LOC_LONG: { type: 'Number' },
        LOC_LAT: { type: 'Number' }
    },
    {
        timestamps: true
    }    

);

// Document model for collection ri_records in MongoDB
const RI_Record = mongoose.model('RI_Record', RI_Record_Schema);
module.exports = RI_Record;