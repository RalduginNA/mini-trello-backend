import { resolve } from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: resolve(__dirname, `../../${process.env.NODE_ENV}.env`) })
