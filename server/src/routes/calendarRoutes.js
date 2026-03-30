import { Router } from 'express';
import auth from '../middleware/auth.js';
import { INDIAN_HOLIDAYS_2026, IPL_2026_SCHEDULE, ISL_2025_26_SCHEDULE, PKL_2026_SCHEDULE } from '../utils/holidays.js';

const router = Router();
router.use(auth);

router.get('/feeds', (req, res) => {
  res.json({
    holidays: INDIAN_HOLIDAYS_2026,
    sports: {
      ipl: { name: 'IPL 2026', sport: 'cricket', color: '#8B5CF6', events: IPL_2026_SCHEDULE },
      isl: { name: 'ISL 2025-26', sport: 'football', color: '#3B82F6', events: ISL_2025_26_SCHEDULE },
      pkl: { name: 'PKL 2026', sport: 'kabaddi', color: '#10B981', events: PKL_2026_SCHEDULE },
    },
  });
});

export default router;
