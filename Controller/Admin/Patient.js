var mongoose = require("mongoose");
const Patient = require("../../Models/patient");
//var Upload = require("../../service/upload");
const {
    Validator
} = require("node-input-validator");
var uuidv1 = require("uuid").v1;


function createToken(data) {
    data.hase = uuidv1();
    return jwt.sign(data, "DonateSmile");
}
const create = async (req, res) => {
    const v = new Validator(req.body, {
        name: "required",
        ssn: "required",
        address: "required",
        phone: "required",
        pcp: "required"
    });
    let matched = await v.check().then((val) => val);
    if (!matched) {
        return res.status(200).send({
            status: false,
            error: v.errors
        });
    }
    let patientData = {
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        ssn: req.body.ssn,
        address:req.body.address,
        phone:req.body.phone,
        pcp:req.body.pcp,
        createdOn: new Date()
    };
    const patient = await new Patient(patientData);
    return patient
        .save()
        .then((data) => {
            return res.status(200).json({
                status: true,
                message: "New Patient Created successfully",
                data: data,
            });
        })
        .catch((error) => {
            res.status(200).json({
                status: false,
                message: "Server error. Please try again.",
                error: error,
            });
        });
};
const update = async (req, res) => {

    return Patient.findOneAndUpdate(
      { _id: { $in: [mongoose.Types.ObjectId(req.params.id)] } },
      req.body,
      async (err, data) => {
        if (err) {
          return res.status(500).json({
            status: false,
            message: "Server error. Please try again.",
            error: err,
          });
        } else if (data != null) {
          data = { ...data._doc, ...req.body };
          return res.status(200).json({
            status: true,
            message: "Patient Content update successful",
            data: data,
          });
        } else {
          return res.status(500).json({
            status: false,
            message: "Patient Content not match",
            data: null,
          });
        }
      }
    );
  };
const viewAll = async (req, res) => {
    return Patient.aggregate([{
                $match: {
                    isDelete: false
                }
            },
            {
                $project: {
                  token: 0,
                  __v: 0,
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ])
        .then((data) => {
            return res.status(200).json({
                status: true,
                message: "Get All Patient content  Successfully",
                data: data,
            });
        })
        .catch((error) => {
            res.status(200).json({
                status: false,
                message: "Server error. Please try again.",
                error: error,
            });
        });
};
const Delete = async (req, res) => {
    return Patient.findOneAndUpdate(
      { _id: { $in: [mongoose.Types.ObjectId(req.params.id)] } },
      {
        isDelete: true
      },
      async (err, data) => {
        if (err) {
          return res.status(500).json({
            status: false,
            message: "Server error. Please try again.",
            error: err,
          });
        } else if (data != null) {
          return res.status(200).json({
            status: true,
            message: "Patient Content Delete successfully",
            data: data,
          });
        } else {
          return res.status(500).json({
            status: false,
            message: "Patient does not match",
            data: null,
          });
        }
      }
    );
  }

  const viewSingel = async (req, res) => {
    return Patient.aggregate([{
                $match: {
                    _id: mongoose.Types.ObjectId(req.params.id)
                }
            },
            
            {
                $project: {
                    "token": 0,
                    __v: 0,
                },
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ])
        .then((data) => {
            if (data && data.length > 0) {
                return res.status(200).json({
                    status: true,
                    message: "Get Patient Singel Successfully",
                    data: data[0],
                });
            } else {
                return res.status(200).json({
                    status: false,
                    message: "No Patient Find",
                    data: null,
                });
            }

        })
        .catch((error) => {
            res.status(200).json({
                status: false,
                message: "Server error. Please try again.",
                error: error,
            });
        });
};
module.exports = {
    create,
    update,
    viewAll,
    Delete,
    viewSingel
};