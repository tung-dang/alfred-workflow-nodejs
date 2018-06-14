import * as fs from 'fs';
import * as path from 'path';
import { Folder } from '../types';

export function getDirs(folderPath: string): Folder[] {
  const dirs: Folder[] = [];

  try {
    const nodes = fs.readdirSync(folderPath);

    if (nodes) {
      nodes.forEach((node: string) => {
        const childFolderPath = path.join(folderPath, node);
        const isDir = fs.statSync(childFolderPath).isDirectory();
        if (isDir) {
          dirs.push({
            path: childFolderPath,
            name: node
          });
        }
      });
    }
  } catch (error) {
    console.error(
      'Can not read folder: ',
      folderPath,
      '. Detail error: ',
      error
    );
  }

  return dirs;
}

/**
 * Check a file is exist or not
 */
export function isFileExists(filePath: string): boolean {
  try {
    fs.accessSync(filePath);
    return true;
  } catch (e) {
    return false;
  }
}

// export function getDirectories(
//   items: Array<GroupPackage | File>,
// ): Array<GroupPackage> {
//   const dirs: any[] = [];
//
//   for (const item of items) {
//     if (item.type === 'dir') {
//       dirs.push(item);
//     }
//   }
//
//   return dirs;
// }

// export function getFiles(items: Array<GroupPackage | File>): Array<File> {
//   const files = [];
//
//   for (const item of items) {
//     if (item.type === 'file') {
//       files.push(item);
//     }
//   }
//
//   return files;
// }

// export function maybeGetById<T: GroupPackage | File>(
//   items: Array<T>,
//   id: string,
// ): T | null {
//   return items.find(item => item.id === id) || null;
// }
//
// export function getById<T: GroupPackage | File>(items: Array<T>, id: string): T {
//   const match = maybeGetById(items, id);
//
//   if (!match) {
//     throw new Error(`Missing ${id} in file system`);
//   }
//
//   return match;
// }

// export function flatMap<T>(
//   dir: GroupPackage,
//   iteratee: (file: File, filePath: string) => T,
// ): Array<T> {
//   const result = [];
//
//   function visit(dir, filePath) {
//     for (const item of dir.children) {
//       const currPath = `${filePath}/${item.id}`;
//       if (item.type === 'dir') {
//         visit(item, currPath);
//       } else {
//         result.push(iteratee(item, currPath));
//       }
//     }
//   }
//
//   visit(dir, dir.id);
//
//   return result;
// }
//
// export function find(
//   dir: GroupPackage,
//   iteratee: (file: File, filePath: string) => boolean,
// ): File | null {
//   function visit(dir, filePath) {
//     for (const item of dir.children) {
//       const currPath = `${filePath}/${item.id}`;
//       if (item.type === 'dir') {
//         const result = visit(item, currPath);
//         if (result) return result;
//       } else if (iteratee(item, currPath)) return item;
//     }
//   }
//
//   return visit(dir, dir.id) || null;
// }
//
// export function findNormalized(dir: GroupPackage, filePath: string) {
//   return find(dir, (file, currPath) => {
//     return normalize(currPath) === filePath;
//   });
// }
//
// export function normalize(filePath: string): string {
//   return filePath
//     .split('/')
//     .map(part => {
//       return part.replace(/^[\d]+-/, '');
//     })
//     .join('/')
//     .replace(/\..*/, '');
// }
//
// export function titleize(filePath: string): string {
//   return sentenceCase(normalize(filePath));
// }
