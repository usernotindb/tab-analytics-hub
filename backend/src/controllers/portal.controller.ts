
import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getAllPortals = async (req: Request, res: Response) => {
  try {
    let query = 'SELECT * FROM portals';
    const queryParams: any[] = [];
    
    // Handle installed filter
    if (req.query.installed !== undefined) {
      const installed = req.query.installed === 'true' ? 1 : 0;
      query += ' WHERE installed = ?';
      queryParams.push(installed);
    }
    
    // Add ordering
    query += ' ORDER BY created_at DESC';
    
    const [portals] = await pool.query(query, queryParams);
    
    res.status(200).json(portals);
  } catch (error) {
    console.error('Error fetching portals:', error);
    res.status(500).json({ message: 'Failed to fetch portals' });
  }
};

export const getPortalById = async (req: Request, res: Response) => {
  try {
    const portalId = req.params.id;
    
    const [portals] = await pool.query(
      'SELECT * FROM portals WHERE id = ?',
      [portalId]
    );
    
    if ((portals as any[]).length === 0) {
      return res.status(404).json({ message: 'Portal not found' });
    }
    
    res.status(200).json((portals as any[])[0]);
  } catch (error) {
    console.error('Error fetching portal:', error);
    res.status(500).json({ message: 'Failed to fetch portal' });
  }
};

export const createPortal = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      company,
      software,
      type,
      userType,
      installed,
      license,
      installed_by
    } = req.body;
    
    // Validate required fields
    if (!userId || !company || !software || !type || !userType) {
      return res.status(400).json({
        message: 'Missing required fields: userId, company, software, type, and userType are required'
      });
    }
    
    const [result] = await pool.query(
      `INSERT INTO portals 
       (userId, company, software, type, userType, installed, license, installed_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, company, software, type, userType, installed || false, license || null, installed_by || null]
    );
    
    const newPortalId = (result as any).insertId;
    
    // If this portal marks an installation, add to timeline events
    if (installed) {
      await pool.query(
        `INSERT INTO timeline_events 
         (entityId, entityType, eventType, description, createdBy)
         VALUES (?, ?, ?, ?, ?)`,
        [
          newPortalId,
          'portal',
          'portal_installed',
          `Portal for ${company} was installed`,
          req.user?.userId || null
        ]
      );
    }
    
    // Fetch the created portal to return
    const [newPortals] = await pool.query(
      'SELECT * FROM portals WHERE id = ?',
      [newPortalId]
    );
    
    res.status(201).json((newPortals as any[])[0]);
  } catch (error) {
    console.error('Error creating portal:', error);
    res.status(500).json({ message: 'Failed to create portal' });
  }
};

export const updatePortal = async (req: Request, res: Response) => {
  try {
    const portalId = req.params.id;
    const {
      userId,
      company,
      software,
      type,
      userType,
      installed,
      license,
      installed_by
    } = req.body;
    
    // Get the current portal data to compare changes
    const [currentPortals] = await pool.query(
      'SELECT * FROM portals WHERE id = ?',
      [portalId]
    );
    
    if ((currentPortals as any[]).length === 0) {
      return res.status(404).json({ message: 'Portal not found' });
    }
    
    const currentPortal = (currentPortals as any[])[0];
    
    // Update the portal
    await pool.query(
      `UPDATE portals SET
       userId = ?,
       company = ?,
       software = ?,
       type = ?,
       userType = ?,
       installed = ?,
       license = ?,
       installed_by = ?,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        userId || currentPortal.userId,
        company || currentPortal.company,
        software || currentPortal.software,
        type || currentPortal.type,
        userType || currentPortal.userType,
        installed !== undefined ? installed : currentPortal.installed,
        license !== undefined ? license : currentPortal.license,
        installed_by !== undefined ? installed_by : currentPortal.installed_by,
        portalId
      ]
    );
    
    // Check if installation status changed
    if (currentPortal.installed === 0 && installed === true) {
      // Portal was just installed, create a timeline event
      await pool.query(
        `INSERT INTO timeline_events 
         (entityId, entityType, eventType, description, createdBy)
         VALUES (?, ?, ?, ?, ?)`,
        [
          portalId,
          'portal',
          'portal_installed',
          `Portal for ${company || currentPortal.company} was installed`,
          req.user?.userId || null
        ]
      );
    }
    
    // Fetch the updated portal to return
    const [updatedPortals] = await pool.query(
      'SELECT * FROM portals WHERE id = ?',
      [portalId]
    );
    
    res.status(200).json((updatedPortals as any[])[0]);
  } catch (error) {
    console.error('Error updating portal:', error);
    res.status(500).json({ message: 'Failed to update portal' });
  }
};

export const deletePortal = async (req: Request, res: Response) => {
  try {
    const portalId = req.params.id;
    
    // Check if portal exists
    const [portals] = await pool.query(
      'SELECT * FROM portals WHERE id = ?',
      [portalId]
    );
    
    if ((portals as any[]).length === 0) {
      return res.status(404).json({ message: 'Portal not found' });
    }
    
    // Delete related timeline events
    await pool.query(
      'DELETE FROM timeline_events WHERE entityId = ? AND entityType = ?',
      [portalId, 'portal']
    );
    
    // Delete the portal
    await pool.query(
      'DELETE FROM portals WHERE id = ?',
      [portalId]
    );
    
    res.status(200).json({ message: 'Portal deleted successfully' });
  } catch (error) {
    console.error('Error deleting portal:', error);
    res.status(500).json({ message: 'Failed to delete portal' });
  }
};
