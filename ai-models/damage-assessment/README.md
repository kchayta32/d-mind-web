
# Damage Assessment AI Model

This directory contains the trained AI model for damage assessment analysis.

## Structure

- `model.json` or `model.h5` - Main model file
- `weights/` - Model weights directory
- `preprocessing/` - Preprocessing utilities and configurations
- `config.json` - Model configuration file

## Usage

Upload your trained model files to this directory structure:

1. Place your main model file (`model.json` or `model.h5`) in this directory
2. Add model weights to the `weights/` subdirectory
3. Add preprocessing scripts/configs to the `preprocessing/` subdirectory
4. Configure model settings in `config.json`

## Integration

The model will be integrated with the damage assessment system through the Edge Function at:
`supabase/functions/analyze-damage/index.ts`
