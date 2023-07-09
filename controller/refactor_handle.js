import asyncHandler from "express-async-handler";

import { ApiFeature } from "../utils/api-feature.js";
import { Api_Error } from "../utils/api-error.js";

export const createOne = (model) =>
    asyncHandler(async (req, res) => {
        const document = await model.create(req.body);
        res.status(201).json({ data: document });
    });

export const getAll = (model, modelName) =>
    asyncHandler(async (req, res) => {
        // build query
        const documentCount = await model.countDocuments();
        const feature = new ApiFeature(model.find(), req.query)
            .filter().sort().limitFields().search(modelName).pagination(documentCount);
        
        const { mongooseQuery, paginationInfo } = feature;
        const document = await mongooseQuery;
        res.status(200).json({ result: document.length, paginationInfo, data: document });
    });

export const getOne = (model) =>
    asyncHandler(async (req, res, next) => {
        const document = await model.findById(req.params.id);
        if (!document) {
            return next(new Api_Error(`no document in this id : ${req.params.id}`, 404));
        }
        res.status(200).json({ data: document });
    });

export const updateOne = (model) =>
    asyncHandler(async (req, res, next) => {
        const document = await model.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!document) {
            return next(new Api_Error(`no document in this id : ${req.params.id}`, 404))
        }
        res.status(200).json({ data: document })
    });

export const deleteOne = (model) =>
    asyncHandler(async (req, res, next) => {
        const document = await model.findByIdAndDelete(req.params.id);
        if (!document) {
            return next(new Api_Error(`no document in this id : ${req.params.id}`, 404));
        }
        res.status(204).send();
    });